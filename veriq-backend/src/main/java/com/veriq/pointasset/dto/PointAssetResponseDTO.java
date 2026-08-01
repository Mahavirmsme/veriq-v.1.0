package com.veriq.pointasset.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PointAssetResponseDTO {

    private UUID id;
    private UUID assetId;
    private String assetName;
    private String pointAssetCode;
    private String pointAssetName;
    private String pointAssetType;
    private BigDecimal startChainage;
    private BigDecimal structureLengthMeters;
    private BigDecimal endChainage;
    private BigDecimal locationChainage;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;

    public PointAssetResponseDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
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

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
