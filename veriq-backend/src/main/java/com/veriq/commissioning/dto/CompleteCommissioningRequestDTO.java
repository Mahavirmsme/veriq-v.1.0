package com.veriq.commissioning.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CompleteCommissioningRequestDTO {

    @NotNull(message = "Engineering Node ID is required")
    private UUID engineeringNodeId;

    private String remarks;

    public CompleteCommissioningRequestDTO() {}

    public UUID getEngineeringNodeId() {
        return engineeringNodeId;
    }

    public void setEngineeringNodeId(UUID engineeringNodeId) {
        this.engineeringNodeId = engineeringNodeId;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
