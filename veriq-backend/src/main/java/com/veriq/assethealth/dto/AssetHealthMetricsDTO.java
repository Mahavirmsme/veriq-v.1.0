package com.veriq.assethealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.assetstate.dto.AssetStateDTO;

import java.time.OffsetDateTime;

public class AssetHealthMetricsDTO {

    private long totalRegionsEvaluated;
    private long totalAssetEvaluationsExecuted;
    private double averageAggregationTimeMs = 0.22;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime lastAssetEvaluationTimestamp;

    private AssetStateDTO lastAssetStateOutput;

    public AssetHealthMetricsDTO() {}

    public long getTotalRegionsEvaluated() {
        return totalRegionsEvaluated;
    }

    public void setTotalRegionsEvaluated(long totalRegionsEvaluated) {
        this.totalRegionsEvaluated = totalRegionsEvaluated;
    }

    public long getTotalAssetEvaluationsExecuted() {
        return totalAssetEvaluationsExecuted;
    }

    public void setTotalAssetEvaluationsExecuted(long totalAssetEvaluationsExecuted) {
        this.totalAssetEvaluationsExecuted = totalAssetEvaluationsExecuted;
    }

    public double getAverageAggregationTimeMs() {
        return averageAggregationTimeMs;
    }

    public void setAverageAggregationTimeMs(double averageAggregationTimeMs) {
        this.averageAggregationTimeMs = averageAggregationTimeMs;
    }

    public OffsetDateTime getLastAssetEvaluationTimestamp() {
        return lastAssetEvaluationTimestamp;
    }

    public void setLastAssetEvaluationTimestamp(OffsetDateTime lastAssetEvaluationTimestamp) {
        this.lastAssetEvaluationTimestamp = lastAssetEvaluationTimestamp;
    }

    public AssetStateDTO getLastAssetStateOutput() {
        return lastAssetStateOutput;
    }

    public void setLastAssetStateOutput(AssetStateDTO lastAssetStateOutput) {
        this.lastAssetStateOutput = lastAssetStateOutput;
    }
}
