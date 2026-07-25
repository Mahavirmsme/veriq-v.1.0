package com.veriq.engineeringengine.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class EngineeringObservation {

    private UUID observationId = UUID.randomUUID();
    private UUID runtimeSensorId;
    private String sensorCode;
    private String sensorType;
    private Double measuredValue;
    private String unit;
    private String observation; // e.g. LIGHT_RAIN, NORMAL_VIBRATION, STABLE_TILT, NOT_IMPLEMENTED_YET
    private Double confidence = 1.0;
    private String interpreterName;
    private String interpreterVersion = "v1.0.0";
    private String status = "ACTIVE"; // ACTIVE, PLACEHOLDER
    private String reason; // e.g. "Interpreter Pending"

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime observationTimestamp = OffsetDateTime.now();

    public EngineeringObservation() {}

    public UUID getObservationId() {
        return observationId;
    }

    public void setObservationId(UUID observationId) {
        this.observationId = observationId;
    }

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

    public Double getMeasuredValue() {
        return measuredValue;
    }

    public void setMeasuredValue(Double measuredValue) {
        this.measuredValue = measuredValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getInterpreterName() {
        return interpreterName;
    }

    public void setInterpreterName(String interpreterName) {
        this.interpreterName = interpreterName;
    }

    public String getInterpreterVersion() {
        return interpreterVersion;
    }

    public void setInterpreterVersion(String interpreterVersion) {
        this.interpreterVersion = interpreterVersion;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public OffsetDateTime getObservationTimestamp() {
        return observationTimestamp;
    }

    public void setObservationTimestamp(OffsetDateTime observationTimestamp) {
        this.observationTimestamp = observationTimestamp;
    }
}
