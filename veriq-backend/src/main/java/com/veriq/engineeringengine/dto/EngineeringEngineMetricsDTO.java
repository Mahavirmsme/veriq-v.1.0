package com.veriq.engineeringengine.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public class EngineeringEngineMetricsDTO {

    private long totalTelemetryReceived;
    private long totalObservationsGenerated;
    private long placeholderUsageCount;
    private int registeredSensorsCount;
    private double averageProcessingTimeMs = 0.28;
    private String lastInterpreterUsed;
    private String lastObservationResult;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastObservationTimestamp;

    private EngineeringObservation lastObservation;

    public EngineeringEngineMetricsDTO() {}

    public long getTotalTelemetryReceived() {
        return totalTelemetryReceived;
    }

    public void setTotalTelemetryReceived(long totalTelemetryReceived) {
        this.totalTelemetryReceived = totalTelemetryReceived;
    }

    public long getTotalObservationsGenerated() {
        return totalObservationsGenerated;
    }

    public void setTotalObservationsGenerated(long totalObservationsGenerated) {
        this.totalObservationsGenerated = totalObservationsGenerated;
    }

    public long getPlaceholderUsageCount() {
        return placeholderUsageCount;
    }

    public void setPlaceholderUsageCount(long placeholderUsageCount) {
        this.placeholderUsageCount = placeholderUsageCount;
    }

    public int getRegisteredSensorsCount() {
        return registeredSensorsCount;
    }

    public void setRegisteredSensorsCount(int registeredSensorsCount) {
        this.registeredSensorsCount = registeredSensorsCount;
    }

    public double getAverageProcessingTimeMs() {
        return averageProcessingTimeMs;
    }

    public void setAverageProcessingTimeMs(double averageProcessingTimeMs) {
        this.averageProcessingTimeMs = averageProcessingTimeMs;
    }

    public String getLastInterpreterUsed() {
        return lastInterpreterUsed;
    }

    public void setLastInterpreterUsed(String lastInterpreterUsed) {
        this.lastInterpreterUsed = lastInterpreterUsed;
    }

    public String getLastObservationResult() {
        return lastObservationResult;
    }

    public void setLastObservationResult(String lastObservationResult) {
        this.lastObservationResult = lastObservationResult;
    }

    public OffsetDateTime getLastObservationTimestamp() {
        return lastObservationTimestamp;
    }

    public void setLastObservationTimestamp(OffsetDateTime lastObservationTimestamp) {
        this.lastObservationTimestamp = lastObservationTimestamp;
    }

    public EngineeringObservation getLastObservation() {
        return lastObservation;
    }

    public void setLastObservation(EngineeringObservation lastObservation) {
        this.lastObservation = lastObservation;
    }
}
