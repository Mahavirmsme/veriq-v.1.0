package com.veriq.runtimeservicemanager.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class SensorReadingData {

    private UUID runtimeSensorId;
    private String sensorCode;
    private String sensorType;
    private OffsetDateTime timestamp;
    private Double currentValue;
    private String unit;
    private String quality = "GOOD"; // GOOD, UNCERTAIN, BAD
    private String communicationStatus = "CONNECTED"; // CONNECTED, TIMEOUT, DISCONNECTED

    public SensorReadingData() {}

    public UUID getRuntimeSensorId() {
        return runtimeSensorId;
    }

    public void setRuntimeSensorId(UUID runtimeSensorId) {
        this.runtimeSensorId = runtimeSensorId;
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

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getCurrentValue() {
        return currentValue;
    }

    public void setCurrentValue(Double currentValue) {
        this.currentValue = currentValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public String getCommunicationStatus() {
        return communicationStatus;
    }

    public void setCommunicationStatus(String communicationStatus) {
        this.communicationStatus = communicationStatus;
    }
}
