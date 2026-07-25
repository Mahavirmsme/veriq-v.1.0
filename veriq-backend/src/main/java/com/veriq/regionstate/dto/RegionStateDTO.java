package com.veriq.regionstate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class RegionStateDTO {

    private UUID id;
    private UUID regionId;
    private String regionName;
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE
    private String previousHealth;
    private Integer totalZones;
    private Integer healthyZones;
    private Integer warningZones;
    private Integer criticalZones;
    private Integer offlineZones;
    private String evaluationVersion;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public RegionStateDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRegionId() {
        return regionId;
    }

    public void setRegionId(UUID regionId) {
        this.regionId = regionId;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
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

    public Integer getTotalZones() {
        return totalZones;
    }

    public void setTotalZones(Integer totalZones) {
        this.totalZones = totalZones;
    }

    public Integer getHealthyZones() {
        return healthyZones;
    }

    public void setHealthyZones(Integer healthyZones) {
        this.healthyZones = healthyZones;
    }

    public Integer getWarningZones() {
        return warningZones;
    }

    public void setWarningZones(Integer warningZones) {
        this.warningZones = warningZones;
    }

    public Integer getCriticalZones() {
        return criticalZones;
    }

    public void setCriticalZones(Integer criticalZones) {
        this.criticalZones = criticalZones;
    }

    public Integer getOfflineZones() {
        return offlineZones;
    }

    public void setOfflineZones(Integer offlineZones) {
        this.offlineZones = offlineZones;
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
