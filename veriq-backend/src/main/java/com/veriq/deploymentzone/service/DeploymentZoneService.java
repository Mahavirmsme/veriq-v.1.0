package com.veriq.deploymentzone.service;

import com.veriq.deploymentzone.dto.DeploymentZoneResponseDTO;
import com.veriq.deploymentzone.dto.SaveDeploymentZonesRequestDTO;

import java.util.List;
import java.util.UUID;

public interface DeploymentZoneService {

    List<DeploymentZoneResponseDTO> getZonesByRegionId(UUID regionId);

    List<DeploymentZoneResponseDTO> saveDeploymentZones(SaveDeploymentZonesRequestDTO requestDTO);
}
