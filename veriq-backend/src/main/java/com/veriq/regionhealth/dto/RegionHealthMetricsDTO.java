package com.veriq.regionhealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.regionstate.dto.RegionStateDTO;

import java.time.OffsetDateTime;

public class RegionHealthMetricsDTO {

    private long totalZonesEvaluated;
    private long totalRegionEvaluationsExecuted;
    private double averageAggregationTimeMs = 0.25;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastRegionEvaluationTimestamp;

    private RegionStateDTO lastRegionStateOutput;

    public RegionHealthMetricsDTO() {}

    public long getTotalZonesEvaluated() {
        return totalZonesEvaluated;
    }

    public void setTotalZonesEvaluated(long totalZonesEvaluated) {
        this.totalZonesEvaluated = totalZonesEvaluated;
    }

    public long getTotalRegionEvaluationsExecuted() {
        return totalRegionEvaluationsExecuted;
    }

    public void setTotalRegionEvaluationsExecuted(long totalRegionEvaluationsExecuted) {
        this.totalRegionEvaluationsExecuted = totalRegionEvaluationsExecuted;
    }

    public double getAverageAggregationTimeMs() {
        return averageAggregationTimeMs;
    }

    public void setAverageAggregationTimeMs(double averageAggregationTimeMs) {
        this.averageAggregationTimeMs = averageAggregationTimeMs;
    }

    public OffsetDateTime getLastRegionEvaluationTimestamp() {
        return lastRegionEvaluationTimestamp;
    }

    public void setLastRegionEvaluationTimestamp(OffsetDateTime lastRegionEvaluationTimestamp) {
        this.lastRegionEvaluationTimestamp = lastRegionEvaluationTimestamp;
    }

    public RegionStateDTO getLastRegionStateOutput() {
        return lastRegionStateOutput;
    }

    public void setLastRegionStateOutput(RegionStateDTO lastRegionStateOutput) {
        this.lastRegionStateOutput = lastRegionStateOutput;
    }
}
