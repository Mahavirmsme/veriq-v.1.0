package com.veriq.commissioning.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CommissioningRecordResponseDTO {

    private UUID id;
    private UUID engineeringNodeId;
    private String nodeCode;
    private Integer nodeNumber;
    private UUID sensorPackageId;
    private String status; // NOT_STARTED, IN_PROGRESS, PARTIALLY_COMMISSIONED, COMMISSIONED
    private String remarks;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime commissionedDate;

    private List<RuntimeSensorResponseDTO> runtimeSensors = new ArrayList<>();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public static class RuntimeSensorResponseDTO {
        private UUID id;
        private String sensorCode;
        private String sensorType;
        private String measurementParameter;
        private String sensorStatus;

        public RuntimeSensorResponseDTO() {}

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

        public String getSensorStatus() {
            return sensorStatus;
        }

        public void setSensorStatus(String sensorStatus) {
            this.sensorStatus = sensorStatus;
        }
    }

    public CommissioningRecordResponseDTO() {}

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

    public UUID getSensorPackageId() {
        return sensorPackageId;
    }

    public void setSensorPackageId(UUID sensorPackageId) {
        this.sensorPackageId = sensorPackageId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public OffsetDateTime getCommissionedDate() {
        return commissionedDate;
    }

    public void setCommissionedDate(OffsetDateTime commissionedDate) {
        this.commissionedDate = commissionedDate;
    }

    public List<RuntimeSensorResponseDTO> getRuntimeSensors() {
        return runtimeSensors;
    }

    public void setRuntimeSensors(List<RuntimeSensorResponseDTO> runtimeSensors) {
        this.runtimeSensors = runtimeSensors;
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
