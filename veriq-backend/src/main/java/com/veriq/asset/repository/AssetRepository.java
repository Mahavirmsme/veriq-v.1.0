package com.veriq.asset.repository;

import com.veriq.asset.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID> {

    boolean existsByAssetCode(String assetCode);

    boolean existsByAssetName(String assetName);

    Optional<Asset> findByAssetCode(String assetCode);

    List<Asset> findByProjectId(UUID projectId);

    int countByProjectId(UUID projectId);
}
