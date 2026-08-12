package com.veriq.nodestate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class NodeStateDTO {

    private UUID id;
    private UUID engineeringNodeId;
    private String nodeCode;
    private Integer nodeNumber;
    private String currentHealth; // STABLE, WARNING, CRITICAL
    private String previousHealth;
    private String evaluationVersion;
    private Integer observationCount;
    private List<MechanismAssessmentDTO> mechanisms;
    private List<com.veriq.engineeringengine.dto.EngineeringObservationDTO> observations;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    private String healthSource;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public NodeStateDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getEngineeringNodeId() {
        return engineeringNodeId;
    }

    public void setEngineeringNodeId(UUID engineeringNodeId) {
        this.engineeringNodeId = engineeringNodeId;
    }

    public String getNodeCode() {
        return nodeCode;
    }

    public void setNodeCode(String nodeCode) {
        this.nodeCode = nodeCode;
    }

    public Integer getNodeNumber() {
        return nodeNumber;
    }

    public void setNodeNumber(Integer nodeNumber) {
        this.nodeNumber = nodeNumber;
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

    public List<MechanismAssessmentDTO> getMechanisms() {
        return mechanisms;
    }

    public void setMechanisms(List<MechanismAssessmentDTO> mechanisms) {
        this.mechanisms = mechanisms;
    }

    public List<com.veriq.engineeringengine.dto.EngineeringObservationDTO> getObservations() {
        return observations;
    }

    public void setObservations(List<com.veriq.engineeringengine.dto.EngineeringObservationDTO> observations) {
        this.observations = observations;
    }
}
