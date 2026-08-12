package com.veriq.specification.service;

import com.veriq.specification.dto.AssetEngineeringSpecificationDTO;
import com.veriq.specification.model.SpecificationApprovalStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EngineeringSpecificationService {
    List<AssetEngineeringSpecificationDTO> getSpecificationsByAsset(UUID assetId);
    Optional<AssetEngineeringSpecificationDTO> getSpecificationByAssetAndVersion(UUID assetId, String version);
    List<AssetEngineeringSpecificationDTO> getSpecificationsByAssetAndStatus(UUID assetId, SpecificationApprovalStatus status);
}
