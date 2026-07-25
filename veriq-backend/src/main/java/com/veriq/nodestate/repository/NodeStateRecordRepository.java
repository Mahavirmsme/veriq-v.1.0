package com.veriq.nodestate.repository;

import com.veriq.nodestate.entity.NodeStateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NodeStateRecordRepository extends JpaRepository<NodeStateRecord, UUID> {

    Optional<NodeStateRecord> findByEngineeringNodeId(UUID engineeringNodeId);

    boolean existsByEngineeringNodeId(UUID engineeringNodeId);
}
