package com.veriq.assetstate.mapper;

import com.veriq.assetstate.dto.AssetStateDTO;
import com.veriq.assetstate.entity.AssetStateRecord;
import org.springframework.stereotype.Component;

@Component
public class AssetStateMapper {

    public AssetStateDTO toDto(AssetStateRecord entity) {
        if (entity == null) {
            return null;
        }
        AssetStateDTO dto = new AssetStateDTO();
        dto.setId(entity.getId());
        if (entity.getAsset() != null) {
            dto.setAssetId(entity.getAsset().getId());
            dto.setAssetName(entity.getAsset().getAssetName());
        }
        dto.setCurrentHealth(entity.getCurrentHealth());
        dto.setPreviousHealth(entity.getPreviousHealth());
        dto.setTotalRegions(entity.getTotalRegions());
        dto.setHealthyRegions(entity.getHealthyRegions());
        dto.setWarningRegions(entity.getWarningRegions());
        dto.setCriticalRegions(entity.getCriticalRegions());
        dto.setOfflineRegions(entity.getOfflineRegions());
        dto.setEvaluationVersion(entity.getEvaluationVersion());
        dto.setEvaluationTimestamp(entity.getEvaluationTimestamp());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
