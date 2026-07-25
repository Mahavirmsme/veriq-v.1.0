package com.veriq.sensorpackage.repository;

import com.veriq.sensorpackage.entity.SensorPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SensorPackageRepository extends JpaRepository<SensorPackage, UUID> {

    Optional<SensorPackage> findByEngineeringNodeId(UUID engineeringNodeId);

    void deleteByEngineeringNodeId(UUID engineeringNodeId);

    boolean existsByEngineeringNodeId(UUID engineeringNodeId);
}
