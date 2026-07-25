package com.veriq.regionstate.mapper;

import com.veriq.regionstate.dto.RegionStateDTO;
import com.veriq.regionstate.entity.RegionStateRecord;
import org.springframework.stereotype.Component;

@Component
public class RegionStateMapper {

    public RegionStateDTO toDto(RegionStateRecord entity) {
        if (entity == null) {
            return null;
        }
        RegionStateDTO dto = new RegionStateDTO();
        dto.setId(entity.getId());
        if (entity.getRegion() != null) {
            dto.setRegionId(entity.getRegion().getId());
            dto.setRegionName(entity.getRegion().getRegionName());
        }
        dto.setCurrentHealth(entity.getCurrentHealth());
        dto.setPreviousHealth(entity.getPreviousHealth());
        dto.setTotalZones(entity.getTotalZones());
        dto.setHealthyZones(entity.getHealthyZones());
        dto.setWarningZones(entity.getWarningZones());
        dto.setCriticalZones(entity.getCriticalZones());
        dto.setOfflineZones(entity.getOfflineZones());
        dto.setEvaluationVersion(entity.getEvaluationVersion());
        dto.setEvaluationTimestamp(entity.getEvaluationTimestamp());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
