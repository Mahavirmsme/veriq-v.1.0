package com.veriq.nodestate.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.engineeringnode.entity.EngineeringNode;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "node_state_record")
public class NodeStateRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "engineering_node_id", nullable = false, unique = true)
    private EngineeringNode engineeringNode;

    @Column(name = "current_health", nullable = false, length = 30)
    private String currentHealth; // STABLE, WARNING, CRITICAL

    @Column(name = "previous_health", length = 30)
    private String previousHealth;

    @Column(name = "evaluation_version", nullable = false, length = 30)
    private String evaluationVersion = "v1.0.0";

    @Column(name = "observation_count", nullable = false)
    private Integer observationCount = 0;

    @Column(name = "evaluation_timestamp", nullable = false)
    private OffsetDateTime evaluationTimestamp;

    @Column(name = "health_source", nullable = false, length = 100)
    private String healthSource = "Node Health Engine";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public NodeStateRecord() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public EngineeringNode getEngineeringNode() {
        return engineeringNode;
    }

    public void setEngineeringNode(EngineeringNode engineeringNode) {
        this.engineeringNode = engineeringNode;
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

    public String getEvaluationVersion() {
        return evaluationVersion;
    }

    public void setEvaluationVersion(String evaluationVersion) {
        this.evaluationVersion = evaluationVersion;
    }

    public Integer getObservationCount() {
        return observationCount;
    }

    public void setObservationCount(Integer observationCount) {
        this.observationCount = observationCount;
    }

    public OffsetDateTime getEvaluationTimestamp() {
        return evaluationTimestamp;
    }

    public void setEvaluationTimestamp(OffsetDateTime evaluationTimestamp) {
        this.evaluationTimestamp = evaluationTimestamp;
    }

    public String getHealthSource() {
        return healthSource;
    }

    public void setHealthSource(String healthSource) {
        this.healthSource = healthSource;
    }
}
