package com.veriq.sensorpackage.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SensorPackageResponseDTO {

    private UUID id;
    private UUID engineeringNodeId;
    private String nodeCode;
    private Integer nodeNumber;
    private String packageStatus;
    private Integer totalSensorTypes;
    private Integer totalSensorCount;

    private List<SensorPackageItemResponseDTO> items = new ArrayList<>();

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public static class SensorPackageItemResponseDTO {
        private UUID id;
        private String sensorType;
        private Integer quantity;
        private String measurementParameter;
        private String engineeringPurpose;
        private String remarks;

        public SensorPackageItemResponseDTO() {}

        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getSensorType() {
            return sensorType;
        }

        public void setSensorType(String sensorType) {
            this.sensorType = sensorType;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public String getMeasurementParameter() {
            return measurementParameter;
        }

        public void setMeasurementParameter(String measurementParameter) {
            this.measurementParameter = measurementParameter;
        }

        public String getEngineeringPurpose() {
            return engineeringPurpose;
        }

        public void setEngineeringPurpose(String engineeringPurpose) {
            this.engineeringPurpose = engineeringPurpose;
        }

        public String getRemarks() {
            return remarks;
        }

        public void setRemarks(String remarks) {
            this.remarks = remarks;
        }
    }

    public SensorPackageResponseDTO() {}

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

    public String getPackageStatus() {
        return packageStatus;
    }

    public void setPackageStatus(String packageStatus) {
        this.packageStatus = packageStatus;
    }

    public Integer getTotalSensorTypes() {
        return totalSensorTypes;
    }

    public void setTotalSensorTypes(Integer totalSensorTypes) {
        this.totalSensorTypes = totalSensorTypes;
    }

    public Integer getTotalSensorCount() {
        return totalSensorCount;
    }

    public void setTotalSensorCount(Integer totalSensorCount) {
        this.totalSensorCount = totalSensorCount;
    }

    public List<SensorPackageItemResponseDTO> getItems() {
        return items;
    }

    public void setItems(List<SensorPackageItemResponseDTO> items) {
        this.items = items;
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
