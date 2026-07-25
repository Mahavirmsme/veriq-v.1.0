package com.veriq.regionstate.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.region.entity.Region;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "region_state_record")
public class RegionStateRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "region_id", nullable = false, unique = true)
    private Region region;

    @Column(name = "current_health", nullable = false, length = 30)
    private String currentHealth; // UNKNOWN, STABLE, WARNING, CRITICAL, OFFLINE

    @Column(name = "previous_health", length = 30)
    private String previousHealth;

    @Column(name = "total_zones", nullable = false)
    private Integer totalZones = 0;

    @Column(name = "healthy_zones", nullable = false)
    private Integer healthyZones = 0;

    @Column(name = "warning_zones", nullable = false)
    private Integer warningZones = 0;

    @Column(name = "critical_zones", nullable = false)
    private Integer criticalZones = 0;

    @Column(name = "offline_zones", nullable = false)
    private Integer offlineZones = 0;

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

    public RegionStateRecord() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
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
}
