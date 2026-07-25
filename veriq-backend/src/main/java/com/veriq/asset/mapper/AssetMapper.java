package com.veriq.asset.mapper;

import com.veriq.asset.dto.AssetResponseDTO;
import com.veriq.asset.dto.CreateAssetRequestDTO;
import com.veriq.asset.entity.Asset;
import com.veriq.project.entity.Project;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class AssetMapper {

    public AssetResponseDTO toDto(Asset entity) {
        if (entity == null) {
            return null;
        }
        AssetResponseDTO dto = new AssetResponseDTO();
        dto.setId(entity.getId());
        if (entity.getProject() != null) {
            dto.setProjectId(entity.getProject().getId());
            dto.setProjectName(entity.getProject().getProjectName());
            dto.setProjectCode(entity.getProject().getProjectCode());
            if (entity.getProject().getOrganization() != null) {
                dto.setOrganizationId(entity.getProject().getOrganization().getId());
                dto.setOrganizationName(entity.getProject().getOrganization().getName());
            }
        }
        dto.setAssetName(entity.getAssetName());
        dto.setAssetCode(entity.getAssetCode());
        dto.setAssetDescription(entity.getAssetDescription());
        dto.setAssetClass(entity.getAssetClass());
        dto.setAssetNature(entity.getAssetNature());
        dto.setStartChainage(entity.getStartChainage());
        dto.setEndChainage(entity.getEndChainage());
        dto.setTotalLength(entity.getTotalLength());
        dto.setAssetStatus(entity.getAssetStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Asset toEntity(CreateAssetRequestDTO dto, Project project) {
        if (dto == null) {
            return null;
        }
        Asset entity = new Asset();
        entity.setProject(project);
        entity.setAssetName(trimToNull(dto.getAssetName()));
        entity.setAssetCode(dto.getAssetCode() != null ? dto.getAssetCode().toUpperCase().trim() : null);
        entity.setAssetDescription(trimToNull(dto.getAssetDescription()));
        entity.setAssetClass(trimToNull(dto.getAssetClass()));
        entity.setAssetNature(trimToNull(dto.getAssetNature()));

        if ("Linear".equalsIgnoreCase(dto.getAssetNature())) {
            entity.setStartChainage(dto.getStartChainage());
            entity.setEndChainage(dto.getEndChainage());
            if (dto.getEndChainage() != null && dto.getStartChainage() != null) {
                entity.setTotalLength(dto.getEndChainage().subtract(dto.getStartChainage()));
            } else {
                entity.setTotalLength(dto.getTotalLength());
            }
        } else {
            entity.setStartChainage(null);
            entity.setEndChainage(null);
            entity.setTotalLength(null);
        }

        entity.setAssetStatus(dto.getAssetStatus() != null ? dto.getAssetStatus().trim() : "ACTIVE");
        return entity;
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
