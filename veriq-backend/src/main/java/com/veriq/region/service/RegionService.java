package com.veriq.region.service;

import com.veriq.region.dto.RegionResponseDTO;
import com.veriq.region.dto.SaveRegionsRequestDTO;

import java.util.List;
import java.util.UUID;

public interface RegionService {

    List<RegionResponseDTO> getRegionsByAssetId(UUID assetId);

    List<RegionResponseDTO> saveRegions(SaveRegionsRequestDTO requestDTO);
}
