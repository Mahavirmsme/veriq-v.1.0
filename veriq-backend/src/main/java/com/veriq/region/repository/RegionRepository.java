package com.veriq.region.repository;

import com.veriq.region.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegionRepository extends JpaRepository<Region, UUID> {

    List<Region> findByAssetId(UUID assetId);

    List<Region> findByAssetIdOrderByStartChainageAsc(UUID assetId);

    void deleteByAssetId(UUID assetId);

    int countByAssetId(UUID assetId);
}
