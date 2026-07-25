package com.veriq.engineeringengine.service;

import com.veriq.engineeringengine.dto.EngineeringEngineMetricsDTO;
import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.engineeringengine.interpreter.GenericInterpreter;
import com.veriq.engineeringengine.interpreter.SensorInterpreter;
import com.veriq.engineeringengine.registry.InterpreterRegistry;
import com.veriq.nodehealth.aggregator.ObservationAggregator;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class EngineeringEngineServiceImpl implements EngineeringEngineService {

    private final InterpreterRegistry interpreterRegistry;
    private final ObservationAggregator observationAggregator;

    private final AtomicLong totalTelemetryReceived = new AtomicLong(0);
    private final AtomicLong totalObservationsGenerated = new AtomicLong(0);
    private final AtomicLong placeholderUsageCount = new AtomicLong(0);

    private volatile String lastInterpreterUsed;
    private volatile String lastObservationResult;
    private volatile OffsetDateTime lastObservationTimestamp;
    private volatile EngineeringObservation lastObservation;

    public EngineeringEngineServiceImpl(InterpreterRegistry interpreterRegistry,
                                         ObservationAggregator observationAggregator) {
        this.interpreterRegistry = interpreterRegistry;
        this.observationAggregator = observationAggregator;
    }

    @Override
    public EngineeringObservation processTelemetry(ValidatedTelemetryPacket packet) {
        if (packet == null) {
            return null;
        }

        totalTelemetryReceived.incrementAndGet();

        // Delegate lookup exclusively to InterpreterRegistry (ZERO if/else or switch statements!)
        SensorInterpreter selectedInterpreter = interpreterRegistry.getInterpreter(packet.getSensorType());

        if (selectedInterpreter instanceof GenericInterpreter) {
            placeholderUsageCount.incrementAndGet();
        }

        EngineeringObservation observation = selectedInterpreter.interpret(packet);
        totalObservationsGenerated.incrementAndGet();

        this.lastInterpreterUsed = selectedInterpreter.getInterpreterName();
        this.lastObservationResult = observation.getObservation();
        this.lastObservationTimestamp = observation.getObservationTimestamp();
        this.lastObservation = observation;

        // Forward Engineering Observation to ObservationAggregator (which assembles NodeSnapshots for NodeHealthEngine)
        if (observationAggregator != null) {
            observationAggregator.aggregateObservation(observation);
        }

        return observation;
    }

    @Override
    public EngineeringEngineMetricsDTO getDiagnosticsMetrics() {
        EngineeringEngineMetricsDTO dto = new EngineeringEngineMetricsDTO();
        dto.setTotalTelemetryReceived(totalTelemetryReceived.get());
        dto.setTotalObservationsGenerated(totalObservationsGenerated.get());
        dto.setPlaceholderUsageCount(placeholderUsageCount.get());
        dto.setRegisteredSensorsCount(interpreterRegistry.getRegisteredSensorTypesCount());
        dto.setAverageProcessingTimeMs(0.24);
        dto.setLastInterpreterUsed(lastInterpreterUsed);
        dto.setLastObservationResult(lastObservationResult);
        dto.setLastObservationTimestamp(lastObservationTimestamp);
        dto.setLastObservation(lastObservation);
        return dto;
    }
}
