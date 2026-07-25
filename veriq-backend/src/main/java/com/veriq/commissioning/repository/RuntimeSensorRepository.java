package com.veriq.commissioning.repository;

import com.veriq.commissioning.entity.RuntimeSensor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RuntimeSensorRepository extends JpaRepository<RuntimeSensor, UUID> {

    List<RuntimeSensor> findByEngineeringNodeIdOrderBySensorCodeAsc(UUID engineeringNodeId);

    List<RuntimeSensor> findByCommissioningRecordIdOrderBySensorCodeAsc(UUID commissioningRecordId);

    boolean existsBySensorCode(String sensorCode);
}
