package com.veriq.deploymentzonestate.mapper;

import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;
import com.veriq.deploymentzonestate.entity.DeploymentZoneStateRecord;
import org.springframework.stereotype.Component;

@Component
public class DeploymentZoneStateMapper {

    public DeploymentZoneStateDTO toDto(DeploymentZoneStateRecord entity) {
        if (entity == null) {
            return null;
        }
        DeploymentZoneStateDTO dto = new DeploymentZoneStateDTO();
        dto.setId(entity.getId());
        if (entity.getDeploymentZone() != null) {
            dto.setDeploymentZoneId(entity.getDeploymentZone().getId());
            dto.setZoneCode(entity.getDeploymentZone().getZoneCode());
        }
        dto.setCurrentHealth(entity.getCurrentHealth());
        dto.setPreviousHealth(entity.getPreviousHealth());
        dto.setTotalNodes(entity.getTotalNodes());
        dto.setHealthyNodes(entity.getHealthyNodes());
        dto.setWarningNodes(entity.getWarningNodes());
        dto.setCriticalNodes(entity.getCriticalNodes());
        dto.setOfflineNodes(entity.getOfflineNodes());
        dto.setEvaluationVersion(entity.getEvaluationVersion());
        dto.setEvaluationTimestamp(entity.getEvaluationTimestamp());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
