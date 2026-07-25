package com.veriq.assetstate.repository;

import com.veriq.assetstate.entity.AssetStateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetStateRecordRepository extends JpaRepository<AssetStateRecord, UUID> {

    Optional<AssetStateRecord> findByAssetId(UUID assetId);

    boolean existsByAssetId(UUID assetId);
}
