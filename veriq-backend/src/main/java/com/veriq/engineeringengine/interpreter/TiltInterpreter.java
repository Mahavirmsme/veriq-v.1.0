package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class TiltInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return sensorType != null && (sensorType.toLowerCase().contains("tilt") || sensorType.toLowerCase().contains("inclinometer") || sensorType.toLowerCase().contains("accelerometer"));
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet.getValue() != null ? packet.getValue() : 0.0;
        double absVal = Math.abs(val);
        String obsStr;

        if (absVal <= 0.5) {
            obsStr = "STABLE_TILT";
        } else if (absVal <= 2.0) {
            obsStr = "MINOR_DEFLECTION";
        } else {
            obsStr = "SIGNIFICANT_DEFLECTION";
        }

        EngineeringObservation obs = new EngineeringObservation();
        obs.setRuntimeSensorId(packet.getRuntimeSensorId());
        obs.setSensorCode(packet.getSensorCode());
        obs.setSensorType(packet.getSensorType());
        obs.setMeasuredValue(val);
        obs.setUnit(packet.getUnit());
        obs.setObservation(obsStr);
        obs.setConfidence(1.0);
        obs.setStatus("ACTIVE");
        obs.setInterpreterName(getInterpreterName());
        obs.setInterpreterVersion("v1.0.0");
        obs.setObservationTimestamp(OffsetDateTime.now());

        return obs;
    }

    @Override
    public String getInterpreterName() {
        return "Tilt & Inclinometer Interpreter (v1.0.0)";
    }
}
