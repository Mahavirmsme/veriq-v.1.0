package com.veriq.assethealth.service;

import com.veriq.assethealth.dto.AssetHealthMetricsDTO;
import com.veriq.assetstate.dto.AssetStateDTO;

import java.util.List;
import java.util.UUID;

public interface AssetHealthEngineService {

    AssetStateDTO evaluateAssetHealth(UUID assetId);

    List<AssetStateDTO> evaluateAllAssets();

    AssetHealthMetricsDTO getDiagnosticsMetrics();
}
