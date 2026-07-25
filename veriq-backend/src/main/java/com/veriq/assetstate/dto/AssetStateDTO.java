package com.veriq.assetstate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class AssetStateDTO {

    private UUID id;
    private UUID assetId;
    private String assetName;
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE
    private String previousHealth;
    private Integer totalRegions;
    private Integer healthyRegions;
    private Integer warningRegions;
    private Integer criticalRegions;
    private Integer offlineRegions;
    private String evaluationVersion;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public AssetStateDTO() {}

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

    public String getCurrentHealth() {
        return currentHealth;
    }

    public void setCurrentHealth(String currentHealth) {
        this.currentHealth = currentHealth;
    }

    public String getPreviousHealth() {
        return previousHealth;
    }

    public void setPreviousHealth(String previousHealth) {
        this.previousHealth = previousHealth;
    }

    public Integer getTotalRegions() {
        return totalRegions;
    }

    public void setTotalRegions(Integer totalRegions) {
        this.totalRegions = totalRegions;
    }

    public Integer getHealthyRegions() {
        return healthyRegions;
    }

    public void setHealthyRegions(Integer healthyRegions) {
        this.healthyRegions = healthyRegions;
    }

    public Integer getWarningRegions() {
        return warningRegions;
    }

    public void setWarningRegions(Integer warningRegions) {
        this.warningRegions = warningRegions;
    }

    public Integer getCriticalRegions() {
        return criticalRegions;
    }

    public void setCriticalRegions(Integer criticalRegions) {
        this.criticalRegions = criticalRegions;
    }

    public Integer getOfflineRegions() {
        return offlineRegions;
    }

    public void setOfflineRegions(Integer offlineRegions) {
        this.offlineRegions = offlineRegions;
    }

    public String getEvaluationVersion() {
        return evaluationVersion;
    }

    public void setEvaluationVersion(String evaluationVersion) {
        this.evaluationVersion = evaluationVersion;
    }

    public OffsetDateTime getEvaluationTimestamp() {
        return evaluationTimestamp;
    }

    public void setEvaluationTimestamp(OffsetDateTime evaluationTimestamp) {
        this.evaluationTimestamp = evaluationTimestamp;
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
