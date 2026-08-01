package com.veriq.runtimesensor.mapper;

import com.veriq.asset.entity.Asset;
import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.deploymentzone.entity.DeploymentZone;
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
                DeploymentZone zone = entity.getEngineeringNode().getDeploymentZone();
                dto.setDeploymentZoneCode(zone.getZoneCode());

                Asset asset = null;
                if (zone.getRegion() != null) {
                    dto.setRegionCode(zone.getRegion().getRegionCode());
                    asset = zone.getRegion().getAsset();
                } else if (zone.getPointAsset() != null) {
                    dto.setRegionCode(zone.getPointAsset().getPointAssetCode());
                    asset = zone.getPointAsset().getAsset();
                } else if (zone.getAsset() != null) {
                    asset = zone.getAsset();
                }

                if (asset != null) {
                    dto.setAssetName(asset.getAssetName());
                    if (asset.getProject() != null) {
                        dto.setProjectName(asset.getProject().getProjectName());
                    }
                }
            }
        }

        if (entity.getCommissioningRecord() != null) {
            dto.setCommissioningRecordId(entity.getCommissioningRecord().getId());
            String rawId = entity.getCommissioningRecord().getId().toString().toUpperCase().replaceAll("-", "");
            dto.setCommissioningReference("COMM-" + rawId.substring(0, 8));
        }

        dto.setCurrentValue("Operational");
        dto.setLastTelemetry("Active Heartbeat");

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
