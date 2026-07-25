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
