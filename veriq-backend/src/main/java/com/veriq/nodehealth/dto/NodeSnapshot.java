package com.veriq.nodehealth.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.engineeringengine.dto.EngineeringObservation;

import java.time.OffsetDateTime;
import java.util.*;

public class NodeSnapshot {

    private UUID engineeringNodeId;
    private String nodeCode;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime snapshotTime = OffsetDateTime.now();

    private Map<String, EngineeringObservation> observations = new LinkedHashMap<>();

    public NodeSnapshot() {}

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

    public OffsetDateTime getSnapshotTime() {
        return snapshotTime;
    }

    public void setSnapshotTime(OffsetDateTime snapshotTime) {
        this.snapshotTime = snapshotTime;
    }

    public Map<String, EngineeringObservation> getObservations() {
        return observations;
    }

    public void setObservations(Map<String, EngineeringObservation> observations) {
        this.observations = observations;
    }

    public void addObservation(String sensorType, EngineeringObservation obs) {
        this.observations.put(sensorType, obs);
    }

    public EngineeringObservation getObservationForType(String typeKeyword) {
        if (typeKeyword == null || observations == null) return null;
        String lower = typeKeyword.toLowerCase();
        for (Map.Entry<String, EngineeringObservation> entry : observations.entrySet()) {
            if (entry.getKey().toLowerCase().contains(lower)) {
                return entry.getValue();
            }
        }
        return null;
    }
}
