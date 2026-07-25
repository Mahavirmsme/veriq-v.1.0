package com.veriq.deploymentzonestate.service;

import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public interface DeploymentZoneStateRepositoryService {

    DeploymentZoneStateDTO storeZoneHealthState(UUID deploymentZoneId, String currentHealth, int totalNodes, int healthyNodes, int warningNodes, int criticalNodes, int offlineNodes, OffsetDateTime evaluationTimestamp);

    DeploymentZoneStateDTO getLatestZoneState(UUID deploymentZoneId);

    List<DeploymentZoneStateDTO> getAllZoneStates();
}
