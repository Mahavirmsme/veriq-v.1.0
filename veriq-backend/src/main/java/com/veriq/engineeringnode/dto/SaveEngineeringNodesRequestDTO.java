package com.veriq.engineeringnode.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class SaveEngineeringNodesRequestDTO {

    @NotNull(message = "Deployment Zone ID is required")
    private UUID deploymentZoneId;

    @NotEmpty(message = "Nodes list cannot be empty")
    @Valid
    private List<EngineeringNodeItemDTO> nodes;

    public SaveEngineeringNodesRequestDTO() {}

    public UUID getDeploymentZoneId() {
        return deploymentZoneId;
    }

    public void setDeploymentZoneId(UUID deploymentZoneId) {
        this.deploymentZoneId = deploymentZoneId;
    }

    public List<EngineeringNodeItemDTO> getNodes() {
        return nodes;
    }

    public void setNodes(List<EngineeringNodeItemDTO> nodes) {
        this.nodes = nodes;
    }
}
