package com.veriq.pointasset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class CreatePointAssetRequestDTO {

    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotBlank(message = "Point Asset Code is required")
    private String pointAssetCode;

    @NotBlank(message = "Point Asset Name is required")
    private String pointAssetName;

    @NotBlank(message = "Point Asset Type is required")
    private String pointAssetType;

    private BigDecimal startChainage;

    private BigDecimal structureLengthMeters;

    private BigDecimal endChainage;

    private BigDecimal locationChainage;

    private String status = "ACTIVE";

    public CreatePointAssetRequestDTO() {}

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getPointAssetCode() {
        return pointAssetCode;
    }

    public void setPointAssetCode(String pointAssetCode) {
        this.pointAssetCode = pointAssetCode;
    }

    public String getPointAssetName() {
        return pointAssetName;
    }

    public void setPointAssetName(String pointAssetName) {
        this.pointAssetName = pointAssetName;
    }

    public String getPointAssetType() {
        return pointAssetType;
    }

    public void setPointAssetType(String pointAssetType) {
        this.pointAssetType = pointAssetType;
    }

    public BigDecimal getStartChainage() {
        return startChainage;
    }

    public void setStartChainage(BigDecimal startChainage) {
        this.startChainage = startChainage;
    }

    public BigDecimal getStructureLengthMeters() {
        return structureLengthMeters;
    }

    public void setStructureLengthMeters(BigDecimal structureLengthMeters) {
        this.structureLengthMeters = structureLengthMeters;
    }

    public BigDecimal getEndChainage() {
        return endChainage;
    }

    public void setEndChainage(BigDecimal endChainage) {
        this.endChainage = endChainage;
    }

    public BigDecimal getLocationChainage() {
        return locationChainage;
    }

    public void setLocationChainage(BigDecimal locationChainage) {
        this.locationChainage = locationChainage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
