package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class GenericInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return true; // Fallback for all unhandled sensor types
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet != null && packet.getValue() != null ? packet.getValue() : 0.0;

        EngineeringObservation obs = new EngineeringObservation();
        if (packet != null) {
            obs.setRuntimeSensorId(packet.getRuntimeSensorId());
            obs.setSensorCode(packet.getSensorCode());
            obs.setSensorType(packet.getSensorType());
            obs.setMeasuredValue(val);
            obs.setUnit(packet.getUnit());
        }

        obs.setObservation("NOT_IMPLEMENTED_YET");
        obs.setConfidence(0.0);
        obs.setStatus("PLACEHOLDER");
        obs.setReason("Interpreter Pending");
        obs.setInterpreterName(getInterpreterName());
        obs.setInterpreterVersion("v1.0.0-placeholder");
        obs.setObservationTimestamp(OffsetDateTime.now());

        return obs;
    }

    @Override
    public String getInterpreterName() {
        return "Generic Fallback Interpreter";
    }
}
