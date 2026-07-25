package com.veriq.regionstate.service;

import com.veriq.regionstate.dto.RegionStateDTO;
import com.veriq.regionstate.dto.RegionStateMetricsDTO;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface RegionStateRepositoryService {

    RegionStateDTO storeRegionHealthState(UUID regionId, String currentHealth, int totalZones, int healthyZones, int warningZones, int criticalZones, int offlineZones, OffsetDateTime evaluationTimestamp);

    RegionStateDTO getLatestRegionState(UUID regionId);

    List<RegionStateDTO> getAllRegionStates();

    RegionStateMetricsDTO getDiagnosticsMetrics();
}
