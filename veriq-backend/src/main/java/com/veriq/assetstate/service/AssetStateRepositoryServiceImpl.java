package com.veriq.assetstate.service;

import com.veriq.asset.entity.Asset;
import com.veriq.asset.repository.AssetRepository;
import com.veriq.assetstate.dto.AssetStateDTO;
import com.veriq.assetstate.dto.AssetStateMetricsDTO;
import com.veriq.assetstate.entity.AssetStateRecord;
import com.veriq.assetstate.mapper.AssetStateMapper;
import com.veriq.assetstate.repository.AssetStateRecordRepository;
import com.veriq.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssetStateRepositoryServiceImpl implements AssetStateRepositoryService {

    private final AssetStateRecordRepository assetStateRecordRepository;
    private final AssetRepository assetRepository;
    private final AssetStateMapper assetStateMapper;

    private volatile UUID lastUpdatedAssetId;
    private volatile String lastCurrentHealth;
    private volatile String lastPreviousHealth;
    private volatile OffsetDateTime lastEvaluationTimestamp;
    private volatile OffsetDateTime lastRepositoryUpdateTimestamp;
    private volatile AssetStateDTO lastStoredAssetState;

    public AssetStateRepositoryServiceImpl(AssetStateRecordRepository assetStateRecordRepository,
                                           AssetRepository assetRepository,
                                           AssetStateMapper assetStateMapper) {
        this.assetStateRecordRepository = assetStateRecordRepository;
        this.assetRepository = assetRepository;
        this.assetStateMapper = assetStateMapper;
    }

    @Override
    public AssetStateDTO storeAssetHealthState(UUID assetId, String currentHealth, int totalRegions, int healthyRegions, int warningRegions, int criticalRegions, int offlineRegions, OffsetDateTime evaluationTimestamp) {
        if (assetId == null) {
            return null;
        }

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", assetId));

        Optional<AssetStateRecord> existingOpt = assetStateRecordRepository.findByAssetId(assetId);
        AssetStateRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            record.setPreviousHealth(record.getCurrentHealth());
            record.setCurrentHealth(currentHealth);
            record.setTotalRegions(totalRegions);
            record.setHealthyRegions(healthyRegions);
            record.setWarningRegions(warningRegions);
            record.setCriticalRegions(criticalRegions);
            record.setOfflineRegions(offlineRegions);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        } else {
            record = new AssetStateRecord();
            record.setAsset(asset);
            record.setPreviousHealth("NONE");
            record.setCurrentHealth(currentHealth);
            record.setTotalRegions(totalRegions);
            record.setHealthyRegions(healthyRegions);
            record.setWarningRegions(warningRegions);
            record.setCriticalRegions(criticalRegions);
            record.setOfflineRegions(offlineRegions);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        }

        AssetStateRecord saved = assetStateRecordRepository.save(record);
        AssetStateDTO dto = assetStateMapper.toDto(saved);

        this.lastUpdatedAssetId = assetId;
        this.lastCurrentHealth = saved.getCurrentHealth();
        this.lastPreviousHealth = saved.getPreviousHealth();
        this.lastEvaluationTimestamp = saved.getEvaluationTimestamp();
        this.lastRepositoryUpdateTimestamp = OffsetDateTime.now();
        this.lastStoredAssetState = dto;

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public AssetStateDTO getLatestAssetState(UUID assetId) {
        return assetStateRecordRepository.findByAssetId(assetId)
                .map(assetStateMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetStateDTO> getAllAssetStates() {
        return assetStateRecordRepository.findAll().stream()
                .map(assetStateMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetStateMetricsDTO getDiagnosticsMetrics() {
        AssetStateMetricsDTO dto = new AssetStateMetricsDTO();
        dto.setTotalAssetsStored(assetStateRecordRepository.count());
        dto.setLastUpdatedAssetId(lastUpdatedAssetId);
        dto.setCurrentHealth(lastCurrentHealth != null ? lastCurrentHealth : "UNKNOWN");
        dto.setPreviousHealth(lastPreviousHealth != null ? lastPreviousHealth : "NONE");
        dto.setEvaluationVersion("v1.0.0");
        dto.setEvaluationTimestamp(lastEvaluationTimestamp);
        dto.setRepositoryUpdateTimestamp(lastRepositoryUpdateTimestamp);
        dto.setLastStoredAssetState(lastStoredAssetState);
        return dto;
    }
}
