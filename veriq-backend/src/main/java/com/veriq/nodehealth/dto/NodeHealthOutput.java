package com.veriq.nodehealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NodeHealthOutput {

    private UUID engineeringNodeId;
    private String nodeCode;
    private String overallNodeState = "STABLE"; // STABLE, WARNING, CRITICAL
    private int observationCount;
    private int missingSensorsCount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime healthTimestamp = OffsetDateTime.now();

    public NodeHealthOutput() {}

    public UUID getEngineeringNodeId() {
        return engineeringNodeId;
    }

    public void setEngineeringNodeId(UUID engineeringNodeId) {
        this.engineeringNodeId = engineeringNodeId;
    }

    public String getNodeCode() {
        return nodeCode;
    }

    public void setNodeCode(String nodeCode) {
        this.nodeCode = nodeCode;
    }

    public String getOverallNodeState() {
        return overallNodeState;
    }

    public void setOverallNodeState(String overallNodeState) {
        this.overallNodeState = overallNodeState;
    }

    public int getObservationCount() {
        return observationCount;
    }

    public void setObservationCount(int observationCount) {
        this.observationCount = observationCount;
    }

    public int getMissingSensorsCount() {
        return missingSensorsCount;
    }

    public void setMissingSensorsCount(int missingSensorsCount) {
        this.missingSensorsCount = missingSensorsCount;
    }

    public OffsetDateTime getHealthTimestamp() {
        return healthTimestamp;
    }

    public void setHealthTimestamp(OffsetDateTime healthTimestamp) {
        this.healthTimestamp = healthTimestamp;
    }
}
