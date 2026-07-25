package com.veriq.engineeringnode.mapper;

import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.engineeringnode.dto.EngineeringNodeItemDTO;
import com.veriq.engineeringnode.dto.EngineeringNodeResponseDTO;
import com.veriq.engineeringnode.entity.EngineeringNode;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class EngineeringNodeMapper {

    public EngineeringNodeResponseDTO toDto(EngineeringNode entity) {
        if (entity == null) {
            return null;
        }
        EngineeringNodeResponseDTO dto = new EngineeringNodeResponseDTO();
        dto.setId(entity.getId());
        if (entity.getDeploymentZone() != null) {
            dto.setDeploymentZoneId(entity.getDeploymentZone().getId());
            dto.setZoneCode(entity.getDeploymentZone().getZoneCode());
            dto.setZoneName(entity.getDeploymentZone().getZoneName());
            if (entity.getDeploymentZone().getRegion() != null) {
                dto.setRegionCode(entity.getDeploymentZone().getRegion().getRegionCode());
            }
        }
        dto.setNodeCode(entity.getNodeCode());
        dto.setNodeNumber(entity.getNodeNumber());
        dto.setChainage(entity.getChainage());

        // Format chainage: e.g. 5.100 -> 5+100
        if (entity.getChainage() != null) {
            double km = entity.getChainage().doubleValue();
            int wholeKm = (int) km;
            int meters = (int) Math.round((km - wholeKm) * 1000);
            dto.setFormattedChainage(String.format("%d+%03d", wholeKm, meters));
        }

        dto.setGenerationStatus("GENERATED");
        dto.setEngineeringStatus(entity.getNodeStatus() != null ? entity.getNodeStatus() : "VALIDATED");
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public EngineeringNode toEntity(EngineeringNodeItemDTO dto, DeploymentZone deploymentZone) {
        if (dto == null) {
            return null;
        }
        EngineeringNode entity = new EngineeringNode();
        entity.setDeploymentZone(deploymentZone);
        entity.setNodeCode(dto.getNodeCode() != null ? dto.getNodeCode().toUpperCase().trim() : null);
        entity.setNodeNumber(dto.getNodeNumber());
        entity.setChainage(dto.getChainage());
        entity.setNodeStatus("VALIDATED");
        return entity;
    }
}
