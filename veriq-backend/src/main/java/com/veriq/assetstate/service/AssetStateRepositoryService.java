package com.veriq.assetstate.service;

import com.veriq.assetstate.dto.AssetStateDTO;
import com.veriq.assetstate.dto.AssetStateMetricsDTO;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface AssetStateRepositoryService {

    AssetStateDTO storeAssetHealthState(UUID assetId, String currentHealth, int totalRegions, int healthyRegions, int warningRegions, int criticalRegions, int offlineRegions, OffsetDateTime evaluationTimestamp);

    AssetStateDTO getLatestAssetState(UUID assetId);

    List<AssetStateDTO> getAllAssetStates();

    AssetStateMetricsDTO getDiagnosticsMetrics();
}
