package com.veriq.runtimesensor.repository;

import com.veriq.runtimesensor.entity.RuntimeSensorTransitionLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RuntimeSensorTransitionLogRepository extends JpaRepository<RuntimeSensorTransitionLog, UUID> {

    List<RuntimeSensorTransitionLog> findByRuntimeSensorIdOrderByCreatedAtDesc(UUID runtimeSensorId);
}
