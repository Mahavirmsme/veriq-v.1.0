package com.veriq.deploymentzonehealth.service;

import com.veriq.deploymentzonehealth.dto.DeploymentZoneHealthMetricsDTO;
import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;

import java.util.List;
import java.util.UUID;

public interface DeploymentZoneHealthEngineService {

    DeploymentZoneStateDTO evaluateZoneHealth(UUID deploymentZoneId);

    List<DeploymentZoneStateDTO> evaluateAllZones();

    DeploymentZoneHealthMetricsDTO getDiagnosticsMetrics();
}
