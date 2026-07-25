package com.veriq.deploymentzonestate.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.deploymentzone.entity.DeploymentZone;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "deployment_zone_state_record")
public class DeploymentZoneStateRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deployment_zone_id", nullable = false, unique = true)
    private DeploymentZone deploymentZone;

    @Column(name = "current_health", nullable = false, length = 30)
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE

    @Column(name = "previous_health", length = 30)
    private String previousHealth;

    @Column(name = "total_nodes", nullable = false)
    private Integer totalNodes = 0;

    @Column(name = "healthy_nodes", nullable = false)
    private Integer healthyNodes = 0;

    @Column(name = "warning_nodes", nullable = false)
    private Integer warningNodes = 0;

    @Column(name = "critical_nodes", nullable = false)
    private Integer criticalNodes = 0;

    @Column(name = "offline_nodes", nullable = false)
    private Integer offlineNodes = 0;

    @Column(name = "evaluation_version", nullable = false, length = 30)
    private String evaluationVersion = "v1.0.0";

    @Column(name = "evaluation_timestamp", nullable = false)
    private OffsetDateTime evaluationTimestamp;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public DeploymentZoneStateRecord() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DeploymentZone getDeploymentZone() {
        return deploymentZone;
    }

    public void setDeploymentZone(DeploymentZone deploymentZone) {
        this.deploymentZone = deploymentZone;
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
}
