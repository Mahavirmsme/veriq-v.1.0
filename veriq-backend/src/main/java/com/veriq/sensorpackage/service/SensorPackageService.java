package com.veriq.sensorpackage.service;

import com.veriq.sensorpackage.dto.SaveSensorPackageRequestDTO;
import com.veriq.sensorpackage.dto.SensorPackageResponseDTO;

import java.util.UUID;

public interface SensorPackageService {

    SensorPackageResponseDTO getPackageByEngineeringNodeId(UUID engineeringNodeId);

    SensorPackageResponseDTO saveSensorPackage(SaveSensorPackageRequestDTO requestDTO);
}
