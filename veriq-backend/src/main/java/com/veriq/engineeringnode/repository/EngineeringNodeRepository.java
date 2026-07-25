package com.veriq.engineeringnode.repository;

import com.veriq.engineeringnode.entity.EngineeringNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EngineeringNodeRepository extends JpaRepository<EngineeringNode, UUID> {

    List<EngineeringNode> findByDeploymentZoneId(UUID deploymentZoneId);

    List<EngineeringNode> findByDeploymentZoneIdOrderByNodeNumberAsc(UUID deploymentZoneId);

    void deleteByDeploymentZoneId(UUID deploymentZoneId);

    int countByDeploymentZoneId(UUID deploymentZoneId);
}
