package com.veriq.runtimeservicemanager.service;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.commissioning.repository.RuntimeSensorRepository;
import com.veriq.runtimesensor.model.RuntimeSensorStatus;
import com.veriq.runtimesensor.service.RuntimeSensorRegistryService;
import com.veriq.runtimeservicemanager.dto.RuntimeServiceManagerStatusDTO;
import com.veriq.runtimeservicemanager.dto.SensorReadingData;
import com.veriq.runtimeservicemanager.dto.TelemetryPacket;
import com.veriq.runtimeservicemanager.provider.SensorProvider;
import com.veriq.telemetry.service.TelemetryService;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@EnableScheduling
public class RuntimeServiceManagerImpl implements RuntimeServiceManager {

    private final RuntimeSensorRepository runtimeSensorRepository;
    private final SensorProvider sensorProvider;
    private final RuntimeSensorRegistryService runtimeSensorRegistryService;
    private final TelemetryService telemetryService;

    private boolean running = true;
    private long totalCyclesExecuted = 0;
    private long totalPacketsProduced = 0;
    private OffsetDateTime lastCycleTime;
    private final LinkedList<String> executionLogs = new LinkedList<>();

    public RuntimeServiceManagerImpl(RuntimeSensorRepository runtimeSensorRepository,
                                     SensorProvider sensorProvider,
                                     RuntimeSensorRegistryService runtimeSensorRegistryService,
                                     TelemetryService telemetryService) {
        this.runtimeSensorRepository = runtimeSensorRepository;
        this.sensorProvider = sensorProvider;
        this.runtimeSensorRegistryService = runtimeSensorRegistryService;
        this.telemetryService = telemetryService;
        addLog("Runtime Service Manager initialized. Provider: " + sensorProvider.getProviderName());
    }

    @Scheduled(fixedDelay = 15000) // Every 15 seconds
    @Transactional(readOnly = true)
    public void executeScheduledRuntimeCycle() {
        if (!running) {
            return;
        }
        executeCycleInternal("Scheduled 15s Heartbeat");
    }

    @Override
    @Transactional(readOnly = true)
    public List<TelemetryPacket> triggerManualCycle() {
        return executeCycleInternal("Manual Operator Trigger");
    }

    private synchronized List<TelemetryPacket> executeCycleInternal(String triggerSource) {
        lastCycleTime = OffsetDateTime.now();
        totalCyclesExecuted++;

        List<RuntimeSensor> allSensors = runtimeSensorRepository.findAll();

        // Select only Commissioned & Active / Eligible Sensors (PROVISIONED, ACTIVE, RECEIVING_TELEMETRY, COMMUNICATION_LOST)
        // Exclude MAINTENANCE, FAULT, RETIRED and uncommissioned records
        List<RuntimeSensor> eligibleSensors = allSensors.stream()
                .filter(s -> s.getCommissioningRecord() != null && "COMMISSIONED".equalsIgnoreCase(s.getCommissioningRecord().getStatus()))
                .filter(s -> {
                    String status = s.getSensorStatus() != null ? s.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";
                    return !"MAINTENANCE".equals(status) && !"FAULT".equals(status) && !"RETIRED".equals(status);
                })
                .collect(Collectors.toList());

        List<TelemetryPacket> producedPackets = new ArrayList<>();

        for (RuntimeSensor sensor : eligibleSensors) {
            try {
                String currentStatus = sensor.getSensorStatus() != null ? sensor.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";

                // Step 1: Perform authorized PROVISIONED -> ACTIVE transition prior to telemetry processing
                if ("PROVISIONED".equals(currentStatus)) {
                    try {
                        runtimeSensorRegistryService.transitionStatus(sensor.getId(), RuntimeSensorStatus.ACTIVE,
                                "Commissioning complete: Provisioned sensor activated for runtime telemetry streaming.");
                        currentStatus = "ACTIVE";
                        sensor.setSensorStatus("ACTIVE");
                    } catch (Exception ex) {
                        addLog("Failed to activate PROVISIONED sensor " + sensor.getSensorCode() + ": " + ex.getMessage());
                        continue; // Fail safety: do not process telemetry if activation failed
                    }
                }

                // Step 2: Generate telemetry reading and packet
                SensorReadingData reading = sensorProvider.generateReading(sensor);

                TelemetryPacket packet = new TelemetryPacket();
                packet.setRuntimeSensorId(sensor.getId());
                packet.setSensorCode(sensor.getSensorCode());
                packet.setSensorType(sensor.getSensorType());
                packet.setValue(reading.getCurrentValue());
                packet.setUnit(reading.getUnit());
                packet.setQuality(reading.getQuality());
                packet.setTimestamp(reading.getTimestamp());

                producedPackets.add(packet);
                totalPacketsProduced++;

                // Step 3: Transport packet via TelemetryService (Stage 2 Validation now succeeds)
                if (telemetryService != null) {
                    telemetryService.processAndTransport(packet);
                }

                // Step 4: Perform authorized ACTIVE -> RECEIVING_TELEMETRY transition
                if ("ACTIVE".equals(currentStatus) || "COMMUNICATION_LOST".equals(currentStatus) || "RECEIVING_TELEMETRY".equals(currentStatus)) {
                    runtimeSensorRegistryService.transitionStatus(sensor.getId(), RuntimeSensorStatus.RECEIVING_TELEMETRY,
                            "Telemetry Service received valid telemetry packet (" + reading.getCurrentValue() + " " + reading.getUnit() + ")");
                }

            } catch (Exception e) {
                addLog("Error executing cycle for sensor " + sensor.getSensorCode() + ": " + e.getMessage());
            }
        }

        String logMsg = String.format("[%s] Cycle #%d executed via %s. Discovered %d active sensors, produced %d telemetry packets.",
                lastCycleTime.toLocalTime().toString(), totalCyclesExecuted, triggerSource, eligibleSensors.size(), producedPackets.size());
        addLog(logMsg);

        return producedPackets;
    }

    @Override
    public synchronized RuntimeServiceManagerStatusDTO getStatus() {
        RuntimeServiceManagerStatusDTO dto = new RuntimeServiceManagerStatusDTO();
        dto.setRunning(running);
        dto.setIntervalSeconds(15);
        dto.setTotalCyclesExecuted(totalCyclesExecuted);
        dto.setTotalPacketsProduced(totalPacketsProduced);
        dto.setLastCycleTime(lastCycleTime);

        long activeCount = runtimeSensorRepository.findAll().stream()
                .filter(s -> s.getCommissioningRecord() != null && "COMMISSIONED".equalsIgnoreCase(s.getCommissioningRecord().getStatus()))
                .filter(s -> {
                    String st = s.getSensorStatus() != null ? s.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "";
                    return !"MAINTENANCE".equals(st) && !"FAULT".equals(st) && !"RETIRED".equals(st);
                }).count();

        dto.setActiveSensorsCount((int) activeCount);
        dto.setRecentExecutionLogs(new ArrayList<>(executionLogs));
        return dto;
    }

    @Override
    public synchronized void startService() {
        this.running = true;
        addLog("Runtime Service Manager RESUMED by operator.");
    }

    @Override
    public synchronized void pauseService() {
        this.running = false;
        addLog("Runtime Service Manager PAUSED by operator.");
    }

    private void addLog(String message) {
        executionLogs.addFirst("[" + OffsetDateTime.now().toLocalTime().toString() + "] " + message);
        if (executionLogs.size() > 50) {
            executionLogs.removeLast();
        }
    }
}
