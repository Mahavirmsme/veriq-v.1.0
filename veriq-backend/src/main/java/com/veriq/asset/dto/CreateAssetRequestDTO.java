package com.veriq.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateAssetRequestDTO {

    @NotNull(message = "Project ID is required")
    private UUID projectId;

    @NotBlank(message = "Asset name is required")
    @Size(max = 150, message = "Asset name must not exceed 150 characters")
    private String assetName;

    @NotBlank(message = "Asset code is required")
    @Size(max = 50, message = "Asset code must not exceed 50 characters")
    private String assetCode;

    private String assetDescription;

    @NotBlank(message = "Asset class is required")
    private String assetClass;

    @NotBlank(message = "Asset nature is required")
    @Pattern(regexp = "^(Linear|Point)$", message = "Asset nature must be either 'Linear' or 'Point'")
    private String assetNature;

    private BigDecimal startChainage;

    private BigDecimal endChainage;

    private BigDecimal totalLength;

    @NotBlank(message = "Asset status is required")
    private String assetStatus = "ACTIVE";

    public CreateAssetRequestDTO() {}

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode;
    }

    public String getAssetDescription() {
        return assetDescription;
    }

    public void setAssetDescription(String assetDescription) {
        this.assetDescription = assetDescription;
    }

    public String getAssetClass() {
        return assetClass;
    }

    public void setAssetClass(String assetClass) {
        this.assetClass = assetClass;
    }

    public String getAssetNature() {
        return assetNature;
    }

    public void setAssetNature(String assetNature) {
        this.assetNature = assetNature;
    }

    public BigDecimal getStartChainage() {
        return startChainage;
    }

    public void setStartChainage(BigDecimal startChainage) {
        this.startChainage = startChainage;
    }

    public BigDecimal getEndChainage() {
        return endChainage;
    }

    public void setEndChainage(BigDecimal endChainage) {
        this.endChainage = endChainage;
    }

    public BigDecimal getTotalLength() {
        return totalLength;
    }

    public void setTotalLength(BigDecimal totalLength) {
        this.totalLength = totalLength;
    }

    public String getAssetStatus() {
        return assetStatus;
    }

    public void setAssetStatus(String assetStatus) {
        this.assetStatus = assetStatus;
    }
}
