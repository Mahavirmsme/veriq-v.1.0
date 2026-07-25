package com.veriq.nodehealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;

public class NodeHealthMetricsDTO {

    private long totalSnapshotsProcessed;
    private long stableNodesCount;
    private long warningNodesCount;
    private long criticalNodesCount;
    private double averageEvaluationTimeMs = 0.32;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastEvaluationTimestamp;

    private NodeHealthOutput lastNodeHealthOutput;

    public NodeHealthMetricsDTO() {}

    public long getTotalSnapshotsProcessed() {
        return totalSnapshotsProcessed;
    }

    public void setTotalSnapshotsProcessed(long totalSnapshotsProcessed) {
        this.totalSnapshotsProcessed = totalSnapshotsProcessed;
    }

    public long getStableNodesCount() {
        return stableNodesCount;
    }

    public void setStableNodesCount(long stableNodesCount) {
        this.stableNodesCount = stableNodesCount;
    }

    public long getWarningNodesCount() {
        return warningNodesCount;
    }

    public void setWarningNodesCount(long warningNodesCount) {
        this.warningNodesCount = warningNodesCount;
    }

    public long getCriticalNodesCount() {
        return criticalNodesCount;
    }

    public void setCriticalNodesCount(long criticalNodesCount) {
        this.criticalNodesCount = criticalNodesCount;
    }

    public double getAverageEvaluationTimeMs() {
        return averageEvaluationTimeMs;
    }

    public void setAverageEvaluationTimeMs(double averageEvaluationTimeMs) {
        this.averageEvaluationTimeMs = averageEvaluationTimeMs;
    }

    public OffsetDateTime getLastEvaluationTimestamp() {
        return lastEvaluationTimestamp;
    }

    public void setLastEvaluationTimestamp(OffsetDateTime lastEvaluationTimestamp) {
        this.lastEvaluationTimestamp = lastEvaluationTimestamp;
    }

    public NodeHealthOutput getLastNodeHealthOutput() {
        return lastNodeHealthOutput;
    }

    public void setLastNodeHealthOutput(NodeHealthOutput lastNodeHealthOutput) {
        this.lastNodeHealthOutput = lastNodeHealthOutput;
    }
}
