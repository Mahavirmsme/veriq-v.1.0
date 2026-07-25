package com.veriq.telemetry.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public class ValidationMetricsDTO {

    private long totalPacketsReceived;
    private long totalPacketsAccepted;
    private long totalPacketsRejected;
    private String validationSuccessRate = "100.0%";
    private double averageValidationTimeMs = 0.5;
    private String lastRejectionReason = "None (All packets passed validation)";

    private ValidatedTelemetryPacket lastAcceptedPacket;

    public ValidationMetricsDTO() {}

    public long getTotalPacketsReceived() {
        return totalPacketsReceived;
    }

    public void setTotalPacketsReceived(long totalPacketsReceived) {
        this.totalPacketsReceived = totalPacketsReceived;
    }

    public long getTotalPacketsAccepted() {
        return totalPacketsAccepted;
    }

    public void setTotalPacketsAccepted(long totalPacketsAccepted) {
        this.totalPacketsAccepted = totalPacketsAccepted;
    }

    public long getTotalPacketsRejected() {
        return totalPacketsRejected;
    }

    public void setTotalPacketsRejected(long totalPacketsRejected) {
        this.totalPacketsRejected = totalPacketsRejected;
    }

    public String getValidationSuccessRate() {
        return validationSuccessRate;
    }

    public void setValidationSuccessRate(String validationSuccessRate) {
        this.validationSuccessRate = validationSuccessRate;
    }

    public double getAverageValidationTimeMs() {
        return averageValidationTimeMs;
    }

    public void setAverageValidationTimeMs(double averageValidationTimeMs) {
        this.averageValidationTimeMs = averageValidationTimeMs;
    }

    public String getLastRejectionReason() {
        return lastRejectionReason;
    }

    public void setLastRejectionReason(String lastRejectionReason) {
        this.lastRejectionReason = lastRejectionReason;
    }

    public ValidatedTelemetryPacket getLastAcceptedPacket() {
        return lastAcceptedPacket;
    }

    public void setLastAcceptedPacket(ValidatedTelemetryPacket lastAcceptedPacket) {
        this.lastAcceptedPacket = lastAcceptedPacket;
    }
}
