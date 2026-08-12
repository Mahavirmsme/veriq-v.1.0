package com.veriq.specification.repository;

import com.veriq.specification.entity.NodeEngineeringGeometry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NodeEngineeringGeometryRepository extends JpaRepository<NodeEngineeringGeometry, UUID> {
    List<NodeEngineeringGeometry> findBySpecificationId(UUID specificationId);
    Optional<NodeEngineeringGeometry> findBySpecificationIdAndEngineeringNodeId(UUID specificationId, UUID engineeringNodeId);
}
