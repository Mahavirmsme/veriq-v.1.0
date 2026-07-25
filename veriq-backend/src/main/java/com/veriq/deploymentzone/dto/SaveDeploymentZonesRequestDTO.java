package com.veriq.deploymentzone.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class SaveDeploymentZonesRequestDTO {

    @NotNull(message = "Region ID is required")
    private UUID regionId;

    @NotEmpty(message = "Deployment zones list cannot be empty")
    @Valid
    private List<DeploymentZoneItemDTO> zones;

    public SaveDeploymentZonesRequestDTO() {}

    public UUID getRegionId() {
        return regionId;
    }

    public void setRegionId(UUID regionId) {
        this.regionId = regionId;
    }

    public List<DeploymentZoneItemDTO> getZones() {
        return zones;
    }

    public void setZones(List<DeploymentZoneItemDTO> zones) {
        this.zones = zones;
    }
}
