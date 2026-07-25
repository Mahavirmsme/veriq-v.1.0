package com.veriq.deploymentzonestate.repository;

import com.veriq.deploymentzonestate.entity.DeploymentZoneStateRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeploymentZoneStateRecordRepository extends JpaRepository<DeploymentZoneStateRecord, UUID> {

    Optional<DeploymentZoneStateRecord> findByDeploymentZoneId(UUID deploymentZoneId);

    boolean existsByDeploymentZoneId(UUID deploymentZoneId);
}
