package com.veriq.telemetry.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class ValidatedTelemetryPacket {

    private UUID runtimeSensorId;
    private String sensorCode;
    private String sensorType;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime sourceTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime receivedTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime acceptedTimestamp;

    private Long sequenceNumber;
    private Double value;
    private String unit;
    private String quality;
    private String provider;
    private String validationResult = "PASS";

    public ValidatedTelemetryPacket() {}

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

    public OffsetDateTime getSourceTimestamp() {
        return sourceTimestamp;
    }

    public void setSourceTimestamp(OffsetDateTime sourceTimestamp) {
        this.sourceTimestamp = sourceTimestamp;
    }

    public OffsetDateTime getReceivedTimestamp() {
        return receivedTimestamp;
    }

    public void setReceivedTimestamp(OffsetDateTime receivedTimestamp) {
        this.receivedTimestamp = receivedTimestamp;
    }

    public OffsetDateTime getAcceptedTimestamp() {
        return acceptedTimestamp;
    }

    public void setAcceptedTimestamp(OffsetDateTime acceptedTimestamp) {
        this.acceptedTimestamp = acceptedTimestamp;
    }

    public Long getSequenceNumber() {
        return sequenceNumber;
    }

    public void setSequenceNumber(Long sequenceNumber) {
        this.sequenceNumber = sequenceNumber;
    }

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
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

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getValidationResult() {
        return validationResult;
    }

    public void setValidationResult(String validationResult) {
        this.validationResult = validationResult;
    }
}
