package com.veriq.nodehealth.aggregator;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.commissioning.repository.RuntimeSensorRepository;
import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.nodehealth.dto.NodeSnapshot;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ObservationAggregator {

    private final RuntimeSensorRepository runtimeSensorRepository;
    private final NodeHealthAggregatorCallback aggregatorCallback;

    // Cache: Node ID -> Map<Sensor Type, Latest Engineering Observation>
    private final Map<UUID, Map<String, EngineeringObservation>> nodeCache = new ConcurrentHashMap<>();

    public interface NodeHealthAggregatorCallback {
        void onFreshNodeSnapshotProduced(NodeSnapshot snapshot);
    }

    public ObservationAggregator(RuntimeSensorRepository runtimeSensorRepository,
                                 @Lazy NodeHealthAggregatorCallback aggregatorCallback) {
        this.runtimeSensorRepository = runtimeSensorRepository;
        this.aggregatorCallback = aggregatorCallback;
    }

    public NodeSnapshot aggregateObservation(EngineeringObservation observation) {
        if (observation == null || observation.getRuntimeSensorId() == null) {
            return null;
        }

        Optional<RuntimeSensor> sensorOpt = runtimeSensorRepository.findById(observation.getRuntimeSensorId());
        if (sensorOpt.isEmpty() || sensorOpt.get().getEngineeringNode() == null) {
            return null;
        }

        RuntimeSensor sensor = sensorOpt.get();
        UUID nodeId = sensor.getEngineeringNode().getId();
        String nodeCode = sensor.getEngineeringNode().getNodeCode();
        String sensorType = observation.getSensorType() != null ? observation.getSensorType() : "Unknown";

        // Update Node Observation Cache
        Map<String, EngineeringObservation> sensorMap = nodeCache.computeIfAbsent(nodeId, k -> new ConcurrentHashMap<>());
        sensorMap.put(sensorType, observation);

        // Construct Fresh Node Snapshot
        NodeSnapshot snapshot = new NodeSnapshot();
        snapshot.setEngineeringNodeId(nodeId);
        snapshot.setNodeCode(nodeCode);
        snapshot.setSnapshotTime(OffsetDateTime.now());
        snapshot.setObservations(new LinkedHashMap<>(sensorMap));

        // Forward to callback
        if (aggregatorCallback != null) {
            aggregatorCallback.onFreshNodeSnapshotProduced(snapshot);
        }

        return snapshot;
    }

    public Map<UUID, Map<String, EngineeringObservation>> getNodeCache() {
        return nodeCache;
    }
}
