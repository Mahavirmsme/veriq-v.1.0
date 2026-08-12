package com.veriq.specification.repository;

import com.veriq.specification.entity.AssetEngineeringSpecification;
import com.veriq.specification.model.SpecificationApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetEngineeringSpecificationRepository extends JpaRepository<AssetEngineeringSpecification, UUID> {
    List<AssetEngineeringSpecification> findByAssetId(UUID assetId);
    Optional<AssetEngineeringSpecification> findByAssetIdAndSpecificationVersion(UUID assetId, String specificationVersion);
    List<AssetEngineeringSpecification> findByAssetIdAndApprovalStatus(UUID assetId, SpecificationApprovalStatus approvalStatus);
}
