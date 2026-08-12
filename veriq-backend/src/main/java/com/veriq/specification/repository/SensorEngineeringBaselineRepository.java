package com.veriq.specification.repository;

import com.veriq.specification.entity.SensorEngineeringBaseline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SensorEngineeringBaselineRepository extends JpaRepository<SensorEngineeringBaseline, UUID> {
    List<SensorEngineeringBaseline> findBySpecificationId(UUID specificationId);
    Optional<SensorEngineeringBaseline> findBySpecificationIdAndRuntimeSensorId(UUID specificationId, UUID runtimeSensorId);
    Optional<SensorEngineeringBaseline> findFirstByRuntimeSensorId(UUID runtimeSensorId);
}
