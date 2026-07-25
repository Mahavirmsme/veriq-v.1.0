package com.veriq.runtimesensor.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class RuntimeSensorRegistryResponseDTO {

    private UUID id;
    private String sensorCode;
    private String sensorType;
    private String measurementParameter;
    private String runtimeStatus; // Active, Inactive, Offline, Fault, Maintenance
    private String currentStateOwner;

    private UUID engineeringNodeId;
    private String nodeCode;
    private Integer nodeNumber;
    private BigDecimal nodeChainage;
    private String formattedChainage;

    private String deploymentZoneCode;
    private String regionCode;
    private String assetName;
    private String projectName;

    private UUID commissioningRecordId;
    private String commissioningReference;

    private String currentValue = "--";
    private String lastTelemetry = "--";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastTransitionTime;
    private String lastTransitionReason;

    private List<RuntimeSensorTransitionLogDTO> transitionLogs = new ArrayList<>();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public static class RuntimeSensorTransitionLogDTO {
        private UUID id;
        private String previousState;
        private String newState;
        private String transitionOwner;
        private String reason;

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
        private OffsetDateTime createdAt;

        public RuntimeSensorTransitionLogDTO() {}

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
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

    public RuntimeSensorRegistryResponseDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public String getMeasurementParameter() {
        return measurementParameter;
    }

    public void setMeasurementParameter(String measurementParameter) {
        this.measurementParameter = measurementParameter;
    }

    public String getRuntimeStatus() {
        return runtimeStatus;
    }

    public void setRuntimeStatus(String runtimeStatus) {
        this.runtimeStatus = runtimeStatus;
    }

    public String getCurrentStateOwner() {
        return currentStateOwner;
    }

    public void setCurrentStateOwner(String currentStateOwner) {
        this.currentStateOwner = currentStateOwner;
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

    public BigDecimal getNodeChainage() {
        return nodeChainage;
    }

    public void setNodeChainage(BigDecimal nodeChainage) {
        this.nodeChainage = nodeChainage;
    }

    public String getFormattedChainage() {
        return formattedChainage;
    }

    public void setFormattedChainage(String formattedChainage) {
        this.formattedChainage = formattedChainage;
    }

    public String getDeploymentZoneCode() {
        return deploymentZoneCode;
    }

    public void setDeploymentZoneCode(String deploymentZoneCode) {
        this.deploymentZoneCode = deploymentZoneCode;
    }

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public UUID getCommissioningRecordId() {
        return commissioningRecordId;
    }

    public void setCommissioningRecordId(UUID commissioningRecordId) {
        this.commissioningRecordId = commissioningRecordId;
    }

    public String getCommissioningReference() {
        return commissioningReference;
    }

    public void setCommissioningReference(String commissioningReference) {
        this.commissioningReference = commissioningReference;
    }

    public String getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(String currentValue) {
        this.currentValue = currentValue;
    }

    public String getLastTelemetry() {
        return lastTelemetry;
    }

    public void setLastTelemetry(String lastTelemetry) {
        this.lastTelemetry = lastTelemetry;
    }

    public OffsetDateTime getLastTransitionTime() {
        return lastTransitionTime;
    }

    public void setLastTransitionTime(OffsetDateTime lastTransitionTime) {
        this.lastTransitionTime = lastTransitionTime;
    }

    public String getLastTransitionReason() {
        return lastTransitionReason;
    }

    public void setLastTransitionReason(String lastTransitionReason) {
        this.lastTransitionReason = lastTransitionReason;
    }

    public List<RuntimeSensorTransitionLogDTO> getTransitionLogs() {
        return transitionLogs;
    }

    public void setTransitionLogs(List<RuntimeSensorTransitionLogDTO> transitionLogs) {
        this.transitionLogs = transitionLogs;
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
