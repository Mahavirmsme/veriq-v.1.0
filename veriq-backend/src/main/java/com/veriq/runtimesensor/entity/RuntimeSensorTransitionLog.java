package com.veriq.runtimesensor.entity;

import com.veriq.commissioning.entity.RuntimeSensor;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "runtime_sensor_transition_log")
public class RuntimeSensorTransitionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "runtime_sensor_id", nullable = false)
    private RuntimeSensor runtimeSensor;

    @Column(name = "previous_state", nullable = false, length = 50)
    private String previousState;

    @Column(name = "new_state", nullable = false, length = 50)
    private String newState;

    @Column(name = "transition_owner", nullable = false, length = 100)
    private String transitionOwner;

    @Column(name = "reason", nullable = false, length = 255)
    private String reason;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @PrePersist
    public void ensureIdAndDate() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
    }

    public RuntimeSensorTransitionLog() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public RuntimeSensor getRuntimeSensor() {
        return runtimeSensor;
    }

    public void setRuntimeSensor(RuntimeSensor runtimeSensor) {
        this.runtimeSensor = runtimeSensor;
    }

    public String getPreviousState() {
        return previousState;
    }

    public void setPreviousState(String previousState) {
        this.previousState = previousState;
    }

    public String getNewState() {
        return newState;
    }

    public void setNewState(String newState) {
        this.newState = newState;
    }

    public String getTransitionOwner() {
        return transitionOwner;
    }

    public void setTransitionOwner(String transitionOwner) {
        this.transitionOwner = transitionOwner;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
