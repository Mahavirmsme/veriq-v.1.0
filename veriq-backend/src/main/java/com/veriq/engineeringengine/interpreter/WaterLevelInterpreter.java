package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class WaterLevelInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return sensorType != null && (sensorType.toLowerCase().contains("water level") || sensorType.toLowerCase().contains("river stage") || sensorType.toLowerCase().contains("flow meter"));
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet.getValue() != null ? packet.getValue() : 0.0;
        String obsStr;

        if (val < 1.0) {
            obsStr = "LOW_LEVEL";
        } else if (val <= 4.0) {
            obsStr = "NORMAL_LEVEL";
        } else {
            obsStr = "HIGH_LEVEL";
        }

        EngineeringObservation obs = new EngineeringObservation();
        obs.setRuntimeSensorId(packet.getRuntimeSensorId());
        obs.setSensorCode(packet.getSensorCode());
        obs.setSensorType(packet.getSensorType());
        obs.setMeasuredValue(val);
        obs.setUnit(packet.getUnit() != null ? packet.getUnit() : "m");
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
        return "Water Level Interpreter (v1.0.0)";
    }
}
