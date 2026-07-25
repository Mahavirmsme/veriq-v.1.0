package com.veriq.deploymentzonestate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class DeploymentZoneStateDTO {

    private UUID id;
    private UUID deploymentZoneId;
    private String zoneCode;
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE
    private String previousHealth;
    private Integer totalNodes;
    private Integer healthyNodes;
    private Integer warningNodes;
    private Integer criticalNodes;
    private Integer offlineNodes;
    private String evaluationVersion;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public DeploymentZoneStateDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeploymentZoneId() {
        return deploymentZoneId;
    }

    public void setDeploymentZoneId(UUID deploymentZoneId) {
        this.deploymentZoneId = deploymentZoneId;
    }

    public String getZoneCode() {
        return zoneCode;
    }

    public void setZoneCode(String zoneCode) {
        this.zoneCode = zoneCode;
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

    public Integer getTotalNodes() {
        return totalNodes;
    }

    public void setTotalNodes(Integer totalNodes) {
        this.totalNodes = totalNodes;
    }

    public Integer getHealthyNodes() {
        return healthyNodes;
    }

    public void setHealthyNodes(Integer healthyNodes) {
        this.healthyNodes = healthyNodes;
    }

    public Integer getWarningNodes() {
        return warningNodes;
    }

    public void setWarningNodes(Integer warningNodes) {
        this.warningNodes = warningNodes;
    }

    public Integer getCriticalNodes() {
        return criticalNodes;
    }

    public void setCriticalNodes(Integer criticalNodes) {
        this.criticalNodes = criticalNodes;
    }

    public Integer getOfflineNodes() {
        return offlineNodes;
    }

    public void setOfflineNodes(Integer offlineNodes) {
        this.offlineNodes = offlineNodes;
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
