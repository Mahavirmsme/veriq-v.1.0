package com.veriq.pointasset.repository;

import com.veriq.pointasset.entity.PointAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PointAssetRepository extends JpaRepository<PointAsset, UUID> {

    List<PointAsset> findByAssetId(UUID assetId);

    List<PointAsset> findByAssetIdOrderByPointAssetCodeAsc(UUID assetId);

    boolean existsByPointAssetCode(String pointAssetCode);
}
