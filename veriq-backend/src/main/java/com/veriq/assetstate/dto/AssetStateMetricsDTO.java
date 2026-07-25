package com.veriq.assetstate.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class AssetStateMetricsDTO {

    private long totalAssetsStored;
    private UUID lastUpdatedAssetId;
    private String currentHealth;
    private String previousHealth;
    private String evaluationVersion = "v1.0.0";

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime repositoryUpdateTimestamp;

    private AssetStateDTO lastStoredAssetState;

    public AssetStateMetricsDTO() {}

    public long getTotalAssetsStored() {
        return totalAssetsStored;
    }

    public void setTotalAssetsStored(long totalAssetsStored) {
        this.totalAssetsStored = totalAssetsStored;
    }

    public UUID getLastUpdatedAssetId() {
        return lastUpdatedAssetId;
    }

    public void setLastUpdatedAssetId(UUID lastUpdatedAssetId) {
        this.lastUpdatedAssetId = lastUpdatedAssetId;
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

    public AssetStateDTO getLastStoredAssetState() {
        return lastStoredAssetState;
    }

    public void setLastStoredAssetState(AssetStateDTO lastStoredAssetState) {
        this.lastStoredAssetState = lastStoredAssetState;
    }
}
