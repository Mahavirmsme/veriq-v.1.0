package com.veriq.runtimeservicemanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class TelemetryPacket {

    private UUID packetId = UUID.randomUUID();
    private UUID runtimeSensorId;
    private String sensorCode;
    private String sensorType;
    private Double value;
    private String unit;
    private String quality;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime timestamp;

    public TelemetryPacket() {}

    public UUID getPacketId() {
        return packetId;
    }

    public void setPacketId(UUID packetId) {
        this.packetId = packetId;
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

    public OffsetDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(OffsetDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
