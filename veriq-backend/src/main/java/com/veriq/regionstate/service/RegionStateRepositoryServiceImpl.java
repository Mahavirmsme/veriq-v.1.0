package com.veriq.regionstate.service;

import com.veriq.assethealth.service.AssetHealthEngineService;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.region.entity.Region;
import com.veriq.region.repository.RegionRepository;
import com.veriq.regionstate.dto.RegionStateDTO;
import com.veriq.regionstate.dto.RegionStateMetricsDTO;
import com.veriq.regionstate.entity.RegionStateRecord;
import com.veriq.regionstate.mapper.RegionStateMapper;
import com.veriq.regionstate.repository.RegionStateRecordRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RegionStateRepositoryServiceImpl implements RegionStateRepositoryService {

    private final RegionStateRecordRepository regionStateRecordRepository;
    private final RegionRepository regionRepository;
    private final RegionStateMapper regionStateMapper;
    private final AssetHealthEngineService assetHealthEngineService;

    private volatile UUID lastUpdatedRegionId;
    private volatile String lastCurrentHealth;
    private volatile String lastPreviousHealth;
    private volatile OffsetDateTime lastEvaluationTimestamp;
    private volatile OffsetDateTime lastRepositoryUpdateTimestamp;
    private volatile RegionStateDTO lastStoredRegionState;

    public RegionStateRepositoryServiceImpl(RegionStateRecordRepository regionStateRecordRepository,
                                             RegionRepository regionRepository,
                                             RegionStateMapper regionStateMapper,
                                             @Lazy AssetHealthEngineService assetHealthEngineService) {
        this.regionStateRecordRepository = regionStateRecordRepository;
        this.regionRepository = regionRepository;
        this.regionStateMapper = regionStateMapper;
        this.assetHealthEngineService = assetHealthEngineService;
    }

    @Override
    public RegionStateDTO storeRegionHealthState(UUID regionId, String currentHealth, int totalZones, int healthyZones, int warningZones, int criticalZones, int offlineZones, OffsetDateTime evaluationTimestamp) {
        if (regionId == null) {
            return null;
        }

        Region region = regionRepository.findById(regionId)
                .orElseThrow(() -> new ResourceNotFoundException("Region", "id", regionId));

        Optional<RegionStateRecord> existingOpt = regionStateRecordRepository.findByRegionId(regionId);
        RegionStateRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            record.setPreviousHealth(record.getCurrentHealth());
            record.setCurrentHealth(currentHealth);
            record.setTotalZones(totalZones);
            record.setHealthyZones(healthyZones);
            record.setWarningZones(warningZones);
            record.setCriticalZones(criticalZones);
            record.setOfflineZones(offlineZones);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        } else {
            record = new RegionStateRecord();
            record.setRegion(region);
            record.setPreviousHealth("NONE");
            record.setCurrentHealth(currentHealth);
            record.setTotalZones(totalZones);
            record.setHealthyZones(healthyZones);
            record.setWarningZones(warningZones);
            record.setCriticalZones(criticalZones);
            record.setOfflineZones(offlineZones);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        }

        RegionStateRecord saved = regionStateRecordRepository.save(record);
        RegionStateDTO dto = regionStateMapper.toDto(saved);

        this.lastUpdatedRegionId = regionId;
        this.lastCurrentHealth = saved.getCurrentHealth();
        this.lastPreviousHealth = saved.getPreviousHealth();
        this.lastEvaluationTimestamp = saved.getEvaluationTimestamp();
        this.lastRepositoryUpdateTimestamp = OffsetDateTime.now();
        this.lastStoredRegionState = dto;

        // Trigger Asset Health Engine aggregation for parent asset
        if (assetHealthEngineService != null && region.getAsset() != null) {
            assetHealthEngineService.evaluateAssetHealth(region.getAsset().getId());
        }

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public RegionStateDTO getLatestRegionState(UUID regionId) {
        return regionStateRecordRepository.findByRegionId(regionId)
                .map(regionStateMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegionStateDTO> getAllRegionStates() {
        return regionStateRecordRepository.findAll().stream()
                .map(regionStateMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RegionStateMetricsDTO getDiagnosticsMetrics() {
        RegionStateMetricsDTO dto = new RegionStateMetricsDTO();
        dto.setTotalRegionsStored(regionStateRecordRepository.count());
        dto.setLastUpdatedRegionId(lastUpdatedRegionId);
        dto.setCurrentHealth(lastCurrentHealth != null ? lastCurrentHealth : "UNKNOWN");
        dto.setPreviousHealth(lastPreviousHealth != null ? lastPreviousHealth : "NONE");
        dto.setEvaluationVersion("v1.0.0");
        dto.setEvaluationTimestamp(lastEvaluationTimestamp);
        dto.setRepositoryUpdateTimestamp(lastRepositoryUpdateTimestamp);
        dto.setLastStoredRegionState(lastStoredRegionState);
        return dto;
    }
}
