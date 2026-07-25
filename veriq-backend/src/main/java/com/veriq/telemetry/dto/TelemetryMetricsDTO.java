package com.veriq.telemetry.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public class TelemetryMetricsDTO {

    private long totalPacketsReceived;
    private long totalPacketsForwarded;
    private long globalSequenceCounter;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastPacketTimestamp;

    private String lastSensorCode;
    private String lastSensorType;
    private Double lastMeasuredValue;
    private String lastUnit;

    public TelemetryMetricsDTO() {}

    public long getTotalPacketsReceived() {
        return totalPacketsReceived;
    }

    public void setTotalPacketsReceived(long totalPacketsReceived) {
        this.totalPacketsReceived = totalPacketsReceived;
    }

    public long getTotalPacketsForwarded() {
        return totalPacketsForwarded;
    }

    public void setTotalPacketsForwarded(long totalPacketsForwarded) {
        this.totalPacketsForwarded = totalPacketsForwarded;
    }

    public long getGlobalSequenceCounter() {
        return globalSequenceCounter;
    }

    public void setGlobalSequenceCounter(long globalSequenceCounter) {
        this.globalSequenceCounter = globalSequenceCounter;
    }

    public OffsetDateTime getLastPacketTimestamp() {
        return lastPacketTimestamp;
    }

    public void setLastPacketTimestamp(OffsetDateTime lastPacketTimestamp) {
        this.lastPacketTimestamp = lastPacketTimestamp;
    }

    public String getLastSensorCode() {
        return lastSensorCode;
    }

    public void setLastSensorCode(String lastSensorCode) {
        this.lastSensorCode = lastSensorCode;
    }

    public String getLastSensorType() {
        return lastSensorType;
    }

    public void setLastSensorType(String lastSensorType) {
        this.lastSensorType = lastSensorType;
    }

    public Double getLastMeasuredValue() {
        return lastMeasuredValue;
    }

    public void setLastMeasuredValue(Double lastMeasuredValue) {
        this.lastMeasuredValue = lastMeasuredValue;
    }

    public String getLastUnit() {
        return lastUnit;
    }

    public void setLastUnit(String lastUnit) {
        this.lastUnit = lastUnit;
    }
}
