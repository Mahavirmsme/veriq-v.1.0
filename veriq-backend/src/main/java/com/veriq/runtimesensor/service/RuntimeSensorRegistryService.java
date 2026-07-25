package com.veriq.runtimesensor.service;

import com.veriq.runtimesensor.dto.RuntimeSensorRegistryResponseDTO;
import com.veriq.runtimesensor.model.RuntimeSensorStatus;

import java.util.List;
import java.util.UUID;

public interface RuntimeSensorRegistryService {

    List<RuntimeSensorRegistryResponseDTO> getAllRuntimeSensors();

    List<RuntimeSensorRegistryResponseDTO> getSensorsByNodeId(UUID engineeringNodeId);

    RuntimeSensorRegistryResponseDTO transitionStatus(UUID sensorId, RuntimeSensorStatus targetStatus, String reason);
}
