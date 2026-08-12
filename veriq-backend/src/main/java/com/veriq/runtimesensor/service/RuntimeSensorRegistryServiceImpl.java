package com.veriq.runtimesensor.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.commissioning.repository.RuntimeSensorRepository;
import com.veriq.runtimesensor.dto.RuntimeSensorRegistryResponseDTO;
import com.veriq.runtimesensor.entity.RuntimeSensorTransitionLog;
import com.veriq.runtimesensor.mapper.RuntimeSensorRegistryMapper;
import com.veriq.runtimesensor.model.RuntimeSensorStatus;
import com.veriq.runtimesensor.repository.RuntimeSensorTransitionLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RuntimeSensorRegistryServiceImpl implements RuntimeSensorRegistryService {

    private final RuntimeSensorRepository runtimeSensorRepository;
    private final RuntimeSensorTransitionLogRepository transitionLogRepository;
    private final RuntimeSensorRegistryMapper runtimeSensorRegistryMapper;

    public RuntimeSensorRegistryServiceImpl(RuntimeSensorRepository runtimeSensorRepository,
                                             RuntimeSensorTransitionLogRepository transitionLogRepository,
                                             RuntimeSensorRegistryMapper runtimeSensorRegistryMapper) {
        this.runtimeSensorRepository = runtimeSensorRepository;
        this.transitionLogRepository = transitionLogRepository;
        this.runtimeSensorRegistryMapper = runtimeSensorRegistryMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RuntimeSensorRegistryResponseDTO> getAllRuntimeSensors() {
        java.util.Map<String, RuntimeSensorRegistryResponseDTO> distinctMap = new java.util.LinkedHashMap<>();
        List<RuntimeSensor> sensors = runtimeSensorRepository.findAll();
        for (RuntimeSensor sensor : sensors) {
            if (sensor.getCommissioningRecord() != null && "COMMISSIONED".equalsIgnoreCase(sensor.getCommissioningRecord().getStatus())) {
                RuntimeSensorRegistryResponseDTO dto = runtimeSensorRegistryMapper.toDto(sensor);
                if (dto != null && dto.getSensorCode() != null) {
                    distinctMap.putIfAbsent(dto.getSensorCode(), dto);
                }
            }
        }
        return new java.util.ArrayList<>(distinctMap.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RuntimeSensorRegistryResponseDTO> getSensorsByNodeId(UUID engineeringNodeId) {
        return runtimeSensorRepository.findByEngineeringNodeIdOrderBySensorCodeAsc(engineeringNodeId).stream()
                .map(runtimeSensorRegistryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public RuntimeSensorRegistryResponseDTO transitionStatus(UUID sensorId, RuntimeSensorStatus targetStatus, String reason) {
        RuntimeSensor sensor = runtimeSensorRepository.findById(sensorId)
                .orElseThrow(() -> new ResourceNotFoundException("RuntimeSensor", "id", sensorId));

        String currentStatusStr = sensor.getSensorStatus() != null ? sensor.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";
        RuntimeSensorStatus currentStatus;
        try {
            currentStatus = RuntimeSensorStatus.valueOf(currentStatusStr);
        } catch (IllegalArgumentException e) {
            currentStatus = RuntimeSensorStatus.PROVISIONED;
        }

        if (!currentStatus.canTransitionTo(targetStatus)) {
            throw new BusinessRuleViolationException("INVALID_LIFECYCLE_TRANSITION",
                    "Cannot transition Runtime Sensor " + sensor.getSensorCode() + " from state [" + currentStatus.getDisplayName() + "] to [" + targetStatus.getDisplayName() + "].");
        }

        String prevDisplayName = currentStatus.getDisplayName();
        String newDisplayName = targetStatus.getDisplayName();
        String owner = targetStatus.getStateOwner();
        String transitionReason = (reason != null && !reason.trim().isEmpty()) ? reason.trim() : "Operational System State Transition to " + newDisplayName;

        sensor.setSensorStatus(targetStatus.name());
        RuntimeSensor saved = runtimeSensorRepository.save(sensor);

        // Record Audit Log Entry
        RuntimeSensorTransitionLog log = new RuntimeSensorTransitionLog();
        log.setRuntimeSensor(saved);
        log.setPreviousState(prevDisplayName);
        log.setNewState(newDisplayName);
        log.setTransitionOwner(owner);
        log.setReason(transitionReason);
        log.setCreatedAt(OffsetDateTime.now());
        transitionLogRepository.save(log);

        return runtimeSensorRegistryMapper.toDto(saved);
    }
}
