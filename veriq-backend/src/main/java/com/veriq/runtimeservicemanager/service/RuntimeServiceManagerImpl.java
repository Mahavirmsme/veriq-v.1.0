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
    public void executeScheduledRuntimeCycle() {
        if (!running) {
            return;
        }
        executeCycleInternal("Scheduled 15s Heartbeat");
    }

    @Override
    public List<TelemetryPacket> triggerManualCycle() {
        return executeCycleInternal("Manual Operator Trigger");
    }

    private synchronized List<TelemetryPacket> executeCycleInternal(String triggerSource) {
        lastCycleTime = OffsetDateTime.now();
        totalCyclesExecuted++;

        List<RuntimeSensor> allSensors = runtimeSensorRepository.findAll();

        // Select only Active / Eligible Sensors (PROVISIONED, ACTIVE, RECEIVING_TELEMETRY, COMMUNICATION_LOST)
        // Exclude MAINTENANCE, FAULT, RETIRED
        List<RuntimeSensor> eligibleSensors = allSensors.stream()
                .filter(s -> {
                    String status = s.getSensorStatus() != null ? s.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";
                    return !"MAINTENANCE".equals(status) && !"FAULT".equals(status) && !"RETIRED".equals(status);
                })
                .collect(Collectors.toList());

        List<TelemetryPacket> producedPackets = new ArrayList<>();

        for (RuntimeSensor sensor : eligibleSensors) {
            try {
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

                // Transport packet via TelemetryService
                if (telemetryService != null) {
                    telemetryService.processAndTransport(packet);
                }

                // Automatically update Runtime Lifecycle State if in PROVISIONED, ACTIVE, or COMMUNICATION_LOST
                String currentStatus = sensor.getSensorStatus() != null ? sensor.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";
                if ("PROVISIONED".equals(currentStatus) || "ACTIVE".equals(currentStatus) || "COMMUNICATION_LOST".equals(currentStatus)) {
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
