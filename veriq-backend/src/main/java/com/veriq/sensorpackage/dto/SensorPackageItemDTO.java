package com.veriq.sensorpackage.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SensorPackageItemDTO {

    @NotBlank(message = "Sensor type is required")
    private String sensorType;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private Integer samplingSeconds = 1;
    private String warningThreshold;
    private String criticalThreshold;
    private String measurementParameter;
    private String engineeringPurpose;
    private String remarks;

    public SensorPackageItemDTO() {}

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

    public Integer getSamplingSeconds() {
        return samplingSeconds;
    }

    public void setSamplingSeconds(Integer samplingSeconds) {
        this.samplingSeconds = samplingSeconds;
    }

    public String getWarningThreshold() {
        return warningThreshold;
    }

    public void setWarningThreshold(String warningThreshold) {
        this.warningThreshold = warningThreshold;
    }

    public String getCriticalThreshold() {
        return criticalThreshold;
    }

    public void setCriticalThreshold(String criticalThreshold) {
        this.criticalThreshold = criticalThreshold;
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
