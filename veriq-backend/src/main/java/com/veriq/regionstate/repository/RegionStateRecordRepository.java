package com.veriq.regionstate.repository;

import com.veriq.regionstate.entity.RegionStateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RegionStateRecordRepository extends JpaRepository<RegionStateRecord, UUID> {

    Optional<RegionStateRecord> findByRegionId(UUID regionId);

    boolean existsByRegionId(UUID regionId);
}
