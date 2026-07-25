package com.veriq.engineeringnode.service;

import com.veriq.engineeringnode.dto.EngineeringNodeResponseDTO;
import com.veriq.engineeringnode.dto.SaveEngineeringNodesRequestDTO;

import java.util.List;
import java.util.UUID;

public interface EngineeringNodeService {

    List<EngineeringNodeResponseDTO> getNodesByDeploymentZoneId(UUID deploymentZoneId);

    List<EngineeringNodeResponseDTO> saveEngineeringNodes(SaveEngineeringNodesRequestDTO requestDTO);
}
