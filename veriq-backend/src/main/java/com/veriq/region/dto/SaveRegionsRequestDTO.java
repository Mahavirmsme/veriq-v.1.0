package com.veriq.region.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class SaveRegionsRequestDTO {

    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotEmpty(message = "Regions list cannot be empty")
    @Valid
    private List<RegionItemDTO> regions;

    public SaveRegionsRequestDTO() {}

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public List<RegionItemDTO> getRegions() {
        return regions;
    }

    public void setRegions(List<RegionItemDTO> regions) {
        this.regions = regions;
    }
}
