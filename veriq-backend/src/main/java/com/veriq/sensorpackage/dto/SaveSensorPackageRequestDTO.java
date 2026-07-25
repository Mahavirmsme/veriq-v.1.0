package com.veriq.sensorpackage.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class SaveSensorPackageRequestDTO {

    @NotNull(message = "Engineering Node ID is required")
    private UUID engineeringNodeId;

    @NotEmpty(message = "Sensor package items cannot be empty")
    @Valid
    private List<SensorPackageItemDTO> items;

    public SaveSensorPackageRequestDTO() {}

    public UUID getEngineeringNodeId() {
        return engineeringNodeId;
    }

    public void setEngineeringNodeId(UUID engineeringNodeId) {
        this.engineeringNodeId = engineeringNodeId;
    }

    public List<SensorPackageItemDTO> getItems() {
        return items;
    }

    public void setItems(List<SensorPackageItemDTO> items) {
        this.items = items;
    }
}
