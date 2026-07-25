package com.veriq.regionstate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class RegionStateMetricsDTO {

    private long totalRegionsStored;
    private UUID lastUpdatedRegionId;
    private String currentHealth;
    private String previousHealth;
    private String evaluationVersion = "v1.0.0";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime repositoryUpdateTimestamp;

    private RegionStateDTO lastStoredRegionState;

    public RegionStateMetricsDTO() {}

    public long getTotalRegionsStored() {
        return totalRegionsStored;
    }

    public void setTotalRegionsStored(long totalRegionsStored) {
        this.totalRegionsStored = totalRegionsStored;
    }

    public UUID getLastUpdatedRegionId() {
        return lastUpdatedRegionId;
    }

    public void setLastUpdatedRegionId(UUID lastUpdatedRegionId) {
        this.lastUpdatedRegionId = lastUpdatedRegionId;
    }

    public String getCurrentHealth() {
        return currentHealth;
    }

    public void setCurrentHealth(String currentHealth) {
        this.currentHealth = currentHealth;
    }

    public String getPreviousHealth() {
        return previousHealth;
    }

    public void setPreviousHealth(String previousHealth) {
        this.previousHealth = previousHealth;
    }

    public String getEvaluationVersion() {
        return evaluationVersion;
    }

    public void setEvaluationVersion(String evaluationVersion) {
        this.evaluationVersion = evaluationVersion;
    }

    public OffsetDateTime getEvaluationTimestamp() {
        return evaluationTimestamp;
    }

    public void setEvaluationTimestamp(OffsetDateTime evaluationTimestamp) {
        this.evaluationTimestamp = evaluationTimestamp;
    }

    public OffsetDateTime getRepositoryUpdateTimestamp() {
        return repositoryUpdateTimestamp;
    }

    public void setRepositoryUpdateTimestamp(OffsetDateTime repositoryUpdateTimestamp) {
        this.repositoryUpdateTimestamp = repositoryUpdateTimestamp;
    }

    public RegionStateDTO getLastStoredRegionState() {
        return lastStoredRegionState;
    }

    public void setLastStoredRegionState(RegionStateDTO lastStoredRegionState) {
        this.lastStoredRegionState = lastStoredRegionState;
    }
}
