package com.veriq.deploymentzone.repository;

import com.veriq.deploymentzone.entity.DeploymentZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeploymentZoneRepository extends JpaRepository<DeploymentZone, UUID> {

    List<DeploymentZone> findByRegionId(UUID regionId);

    List<DeploymentZone> findByRegionIdOrderByStartChainageAsc(UUID regionId);

    List<DeploymentZone> findByAssetId(UUID assetId);

    List<DeploymentZone> findByPointAssetId(UUID pointAssetId);

    List<DeploymentZone> findByRegionAssetId(UUID assetId);

    void deleteByRegionId(UUID regionId);

    void deleteByAssetId(UUID assetId);

    void deleteByPointAssetId(UUID pointAssetId);

    int countByRegionId(UUID regionId);
}
