package com.veriq.pointasset.service;

import com.veriq.pointasset.dto.CreatePointAssetRequestDTO;
import com.veriq.pointasset.dto.PointAssetResponseDTO;

import java.util.List;
import java.util.UUID;

public interface PointAssetService {

    List<PointAssetResponseDTO> getPointAssetsByAssetId(UUID assetId);

    List<PointAssetResponseDTO> getAllPointAssets();

    PointAssetResponseDTO createPointAsset(CreatePointAssetRequestDTO requestDTO);

    void deletePointAsset(UUID id);
}
