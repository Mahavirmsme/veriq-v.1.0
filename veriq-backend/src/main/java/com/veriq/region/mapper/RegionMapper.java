package com.veriq.region.mapper;

import com.veriq.asset.entity.Asset;
import com.veriq.region.dto.RegionItemDTO;
import com.veriq.region.dto.RegionResponseDTO;
import com.veriq.region.entity.Region;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class RegionMapper {

    public RegionResponseDTO toDto(Region entity) {
        if (entity == null) {
            return null;
        }
        RegionResponseDTO dto = new RegionResponseDTO();
        dto.setId(entity.getId());
        if (entity.getAsset() != null) {
            dto.setAssetId(entity.getAsset().getId());
        }
        dto.setRegionCode(entity.getRegionCode());
        dto.setRegionName(entity.getRegionName());
        dto.setStartChainage(entity.getStartChainage());
        dto.setEndChainage(entity.getEndChainage());
        dto.setRegionLength(entity.getRegionLength());
        dto.setRegionStatus(entity.getRegionStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public Region toEntity(RegionItemDTO dto, Asset asset) {
        if (dto == null) {
            return null;
        }
        Region entity = new Region();
        entity.setAsset(asset);
        entity.setRegionCode(dto.getRegionCode() != null ? dto.getRegionCode().toUpperCase().trim() : null);
        entity.setRegionName(dto.getRegionName() != null ? dto.getRegionName().trim() : null);
        entity.setStartChainage(dto.getStartChainage());
        entity.setEndChainage(dto.getEndChainage());

        if (dto.getEndChainage() != null && dto.getStartChainage() != null) {
            entity.setRegionLength(dto.getEndChainage().subtract(dto.getStartChainage()));
        } else {
            entity.setRegionLength(BigDecimal.ZERO);
        }

        entity.setRegionStatus("VALIDATED");
        return entity;
    }
}
