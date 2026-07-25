package com.veriq.regionhealth.service;

import com.veriq.regionhealth.dto.RegionHealthMetricsDTO;
import com.veriq.regionstate.dto.RegionStateDTO;

import java.util.List;
import java.util.UUID;

public interface RegionHealthEngineService {

    RegionStateDTO evaluateRegionHealth(UUID regionId);

    List<RegionStateDTO> evaluateAllRegions();

    RegionHealthMetricsDTO getDiagnosticsMetrics();
}
