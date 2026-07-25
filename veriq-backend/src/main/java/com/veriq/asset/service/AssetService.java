package com.veriq.asset.service;

import com.veriq.asset.dto.AssetResponseDTO;
import com.veriq.asset.dto.CreateAssetRequestDTO;
import com.veriq.asset.dto.UpdateAssetRequestDTO;

import java.util.List;
import java.util.UUID;

public interface AssetService {

    List<AssetResponseDTO> getAllAssets();

    AssetResponseDTO getAssetById(UUID id);

    List<AssetResponseDTO> getAssetsByProjectId(UUID projectId);

    AssetResponseDTO createAsset(CreateAssetRequestDTO requestDTO);

    AssetResponseDTO updateAsset(UUID id, UpdateAssetRequestDTO requestDTO);

    void deleteAsset(UUID id);
}
