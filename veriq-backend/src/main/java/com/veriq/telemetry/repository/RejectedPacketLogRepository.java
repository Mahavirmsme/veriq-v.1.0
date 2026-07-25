package com.veriq.telemetry.repository;

import com.veriq.telemetry.entity.RejectedPacketLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RejectedPacketLogRepository extends JpaRepository<RejectedPacketLog, UUID> {

    List<RejectedPacketLog> findTop20ByOrderByCreatedAtDesc();
}
