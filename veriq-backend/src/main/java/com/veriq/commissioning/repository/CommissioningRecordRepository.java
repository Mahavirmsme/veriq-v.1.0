package com.veriq.commissioning.repository;

import com.veriq.commissioning.entity.CommissioningRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommissioningRecordRepository extends JpaRepository<CommissioningRecord, UUID> {

    Optional<CommissioningRecord> findByEngineeringNodeId(UUID engineeringNodeId);

    boolean existsByEngineeringNodeId(UUID engineeringNodeId);
}
