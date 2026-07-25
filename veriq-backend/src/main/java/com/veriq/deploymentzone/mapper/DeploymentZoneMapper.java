package com.veriq.deploymentzone.mapper;

import com.veriq.deploymentzone.dto.DeploymentZoneItemDTO;
import com.veriq.deploymentzone.dto.DeploymentZoneResponseDTO;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.region.entity.Region;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class DeploymentZoneMapper {

    public DeploymentZoneResponseDTO toDto(DeploymentZone entity) {
        if (entity == null) {
            return null;
        }
        DeploymentZoneResponseDTO dto = new DeploymentZoneResponseDTO();
        dto.setId(entity.getId());
        if (entity.getRegion() != null) {
            dto.setRegionId(entity.getRegion().getId());
        }
        dto.setZoneCode(entity.getZoneCode());
        dto.setZoneName(entity.getZoneName());
        dto.setPriority(entity.getPriority());
        dto.setStartChainage(entity.getStartChainage());
        dto.setEndChainage(entity.getEndChainage());
        dto.setZoneLength(entity.getZoneLength());
        dto.setNodeSpacing(entity.getNodeSpacing());
        dto.setTotalNodes(entity.getTotalNodes());
        dto.setZoneStatus(entity.getZoneStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public DeploymentZone toEntity(DeploymentZoneItemDTO dto, Region region) {
        if (dto == null) {
            return null;
        }
        DeploymentZone entity = new DeploymentZone();
        entity.setRegion(region);
        entity.setZoneCode(dto.getZoneCode() != null ? dto.getZoneCode().toUpperCase().trim() : null);
        entity.setZoneName(dto.getZoneName() != null ? dto.getZoneName().trim() : null);
        entity.setPriority(dto.getPriority() != null ? dto.getPriority().trim() : "High");
        entity.setStartChainage(dto.getStartChainage());
        entity.setEndChainage(dto.getEndChainage());

        BigDecimal spacing = dto.getNodeSpacing() != null && dto.getNodeSpacing().compareTo(BigDecimal.ZERO) > 0
                ? dto.getNodeSpacing() : new BigDecimal("200.00");
        entity.setNodeSpacing(spacing);

        if (dto.getEndChainage() != null && dto.getStartChainage() != null) {
            BigDecimal len = dto.getEndChainage().subtract(dto.getStartChainage());
            entity.setZoneLength(len);
            
            // Total Nodes = Math.floor((lengthInKm * 1000) / spacingInMeters) + 1
            BigDecimal lengthMeters = len.multiply(new BigDecimal("1000"));
            int nodes = lengthMeters.divide(spacing, 0, RoundingMode.FLOOR).intValue() + 1;
            entity.setTotalNodes(Math.max(1, nodes));
        } else {
            entity.setZoneLength(BigDecimal.ZERO);
            entity.setTotalNodes(1);
        }

        entity.setZoneStatus("VALIDATED");
        return entity;
    }
}
