package com.veriq.deploymentzonehealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;

import java.time.OffsetDateTime;

public class DeploymentZoneHealthMetricsDTO {

    private long totalNodesEvaluated;
    private long totalZoneEvaluationsExecuted;
    private double averageAggregationTimeMs = 0.28;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastZoneEvaluationTimestamp;

    private DeploymentZoneStateDTO lastZoneStateOutput;

    public DeploymentZoneHealthMetricsDTO() {}

    public long getTotalNodesEvaluated() {
        return totalNodesEvaluated;
    }

    public void setTotalNodesEvaluated(long totalNodesEvaluated) {
        this.totalNodesEvaluated = totalNodesEvaluated;
    }

    public long getTotalZoneEvaluationsExecuted() {
        return totalZoneEvaluationsExecuted;
    }

    public void setTotalZoneEvaluationsExecuted(long totalZoneEvaluationsExecuted) {
        this.totalZoneEvaluationsExecuted = totalZoneEvaluationsExecuted;
    }

    public double getAverageAggregationTimeMs() {
        return averageAggregationTimeMs;
    }

    public void setAverageAggregationTimeMs(double averageAggregationTimeMs) {
        this.averageAggregationTimeMs = averageAggregationTimeMs;
    }

    public OffsetDateTime getLastZoneEvaluationTimestamp() {
        return lastZoneEvaluationTimestamp;
    }

    public void setLastZoneEvaluationTimestamp(OffsetDateTime lastZoneEvaluationTimestamp) {
        this.lastZoneEvaluationTimestamp = lastZoneEvaluationTimestamp;
    }

    public DeploymentZoneStateDTO getLastZoneStateOutput() {
        return lastZoneStateOutput;
    }

    public void setLastZoneStateOutput(DeploymentZoneStateDTO lastZoneStateOutput) {
        this.lastZoneStateOutput = lastZoneStateOutput;
    }
}
