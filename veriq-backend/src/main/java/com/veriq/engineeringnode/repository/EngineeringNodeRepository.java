package com.veriq.engineeringnode.repository;

import com.veriq.engineeringnode.entity.EngineeringNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EngineeringNodeRepository extends JpaRepository<EngineeringNode, UUID> {

    List<EngineeringNode> findByDeploymentZoneId(UUID deploymentZoneId);

    List<EngineeringNode> findByDeploymentZoneIdOrderByNodeNumberAsc(UUID deploymentZoneId);

    @Query("SELECT n FROM EngineeringNode n WHERE n.deploymentZone.id = :zoneId AND EXISTS (SELECT c FROM CommissioningRecord c WHERE c.engineeringNode.id = n.id AND UPPER(c.status) = 'COMMISSIONED') ORDER BY n.nodeNumber ASC")
    List<EngineeringNode> findCommissionedNodesByDeploymentZoneId(@Param("zoneId") UUID zoneId);

    void deleteByDeploymentZoneId(UUID deploymentZoneId);

    int countByDeploymentZoneId(UUID deploymentZoneId);
}
