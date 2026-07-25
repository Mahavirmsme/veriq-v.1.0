package com.veriq.runtimesensor.mapper;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.runtimesensor.dto.RuntimeSensorRegistryResponseDTO;
import com.veriq.runtimesensor.entity.RuntimeSensorTransitionLog;
import com.veriq.runtimesensor.model.RuntimeSensorStatus;
import com.veriq.runtimesensor.repository.RuntimeSensorTransitionLogRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RuntimeSensorRegistryMapper {

    private final RuntimeSensorTransitionLogRepository transitionLogRepository;

    public RuntimeSensorRegistryMapper(RuntimeSensorTransitionLogRepository transitionLogRepository) {
        this.transitionLogRepository = transitionLogRepository;
    }

    public RuntimeSensorRegistryResponseDTO toDto(RuntimeSensor entity) {
        if (entity == null) {
            return null;
        }
        RuntimeSensorRegistryResponseDTO dto = new RuntimeSensorRegistryResponseDTO();
        dto.setId(entity.getId());
        dto.setSensorCode(entity.getSensorCode());
        dto.setSensorType(entity.getSensorType());
        dto.setMeasurementParameter(entity.getMeasurementParameter());
        
        String rawStatus = entity.getSensorStatus() != null ? entity.getSensorStatus().toUpperCase().replaceAll(" ", "_") : "PROVISIONED";
        RuntimeSensorStatus statusEnum;
        try {
            statusEnum = RuntimeSensorStatus.valueOf(rawStatus);
        } catch (Exception e) {
            statusEnum = RuntimeSensorStatus.PROVISIONED;
        }

        dto.setRuntimeStatus(statusEnum.getDisplayName());
        dto.setCurrentStateOwner(statusEnum.getStateOwner());

        if (entity.getEngineeringNode() != null) {
            dto.setEngineeringNodeId(entity.getEngineeringNode().getId());
            dto.setNodeCode(entity.getEngineeringNode().getNodeCode());
            dto.setNodeNumber(entity.getEngineeringNode().getNodeNumber());
            dto.setNodeChainage(entity.getEngineeringNode().getChainage());

            if (entity.getEngineeringNode().getChainage() != null) {
                double km = entity.getEngineeringNode().getChainage().doubleValue();
                int wholeKm = (int) km;
                int meters = (int) Math.round((km - wholeKm) * 1000);
                dto.setFormattedChainage(String.format("%d+%03d", wholeKm, meters));
            }

            if (entity.getEngineeringNode().getDeploymentZone() != null) {
                dto.setDeploymentZoneCode(entity.getEngineeringNode().getDeploymentZone().getZoneCode());
                if (entity.getEngineeringNode().getDeploymentZone().getRegion() != null) {
                    dto.setRegionCode(entity.getEngineeringNode().getDeploymentZone().getRegion().getRegionCode());
                    if (entity.getEngineeringNode().getDeploymentZone().getRegion().getAsset() != null) {
                        dto.setAssetName(entity.getEngineeringNode().getDeploymentZone().getRegion().getAsset().getAssetName());
                        if (entity.getEngineeringNode().getDeploymentZone().getRegion().getAsset().getProject() != null) {
                            dto.setProjectName(entity.getEngineeringNode().getDeploymentZone().getRegion().getAsset().getProject().getProjectName());
                        }
                    }
                }
            }
        }

        if (entity.getCommissioningRecord() != null) {
            dto.setCommissioningRecordId(entity.getCommissioningRecord().getId());
            String rawId = entity.getCommissioningRecord().getId().toString().toUpperCase().replaceAll("-", "");
            dto.setCommissioningReference("COMM-" + rawId.substring(0, 8));
        }

        dto.setCurrentValue("--");
        dto.setLastTelemetry("--");

        // Fetch Transition Logs from Repository
        if (entity.getId() != null) {
            List<RuntimeSensorTransitionLog> logs = transitionLogRepository.findByRuntimeSensorIdOrderByCreatedAtDesc(entity.getId());
            if (logs != null && !logs.isEmpty()) {
                RuntimeSensorTransitionLog latest = logs.get(0);
                dto.setLastTransitionTime(latest.getCreatedAt());
                dto.setLastTransitionReason(latest.getReason());

                dto.setTransitionLogs(logs.stream().map(l -> {
                    RuntimeSensorRegistryResponseDTO.RuntimeSensorTransitionLogDTO logDto = new RuntimeSensorRegistryResponseDTO.RuntimeSensorTransitionLogDTO();
                    logDto.setId(l.getId());
                    logDto.setPreviousState(l.getPreviousState());
                    logDto.setNewState(l.getNewState());
                    logDto.setTransitionOwner(l.getTransitionOwner());
                    logDto.setReason(l.getReason());
                    logDto.setCreatedAt(l.getCreatedAt());
                    return logDto;
                }).collect(Collectors.toList()));
            } else {
                dto.setLastTransitionTime(entity.getCreatedAt());
                dto.setLastTransitionReason("Runtime Sensor Created from Commissioning Artifact");
            }
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
