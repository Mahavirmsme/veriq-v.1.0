package com.veriq.assetstate.entity;

import com.veriq.asset.entity.Asset;
import com.veriq.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "asset_state_record")
public class AssetStateRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false, unique = true)
    private Asset asset;

    @Column(name = "current_health", nullable = false, length = 30)
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE

    @Column(name = "previous_health", length = 30)
    private String previousHealth;

    @Column(name = "total_regions", nullable = false)
    private Integer totalRegions = 0;

    @Column(name = "healthy_regions", nullable = false)
    private Integer healthyRegions = 0;

    @Column(name = "warning_regions", nullable = false)
    private Integer warningRegions = 0;

    @Column(name = "critical_regions", nullable = false)
    private Integer criticalRegions = 0;

    @Column(name = "offline_regions", nullable = false)
    private Integer offlineRegions = 0;

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

    public AssetStateRecord() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
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
}
