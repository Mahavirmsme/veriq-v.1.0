package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class TemperatureInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return sensorType != null && sensorType.toLowerCase().contains("temperature");
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet.getValue() != null ? packet.getValue() : 0.0;
        String obsStr;

        if (val < 0.0) {
            obsStr = "FREEZING_TEMPERATURE";
        } else if (val <= 40.0) {
            obsStr = "NORMAL_TEMPERATURE";
        } else {
            obsStr = "ELEVATED_TEMPERATURE";
        }

        EngineeringObservation obs = new EngineeringObservation();
        obs.setRuntimeSensorId(packet.getRuntimeSensorId());
        obs.setSensorCode(packet.getSensorCode());
        obs.setSensorType(packet.getSensorType());
        obs.setMeasuredValue(val);
        obs.setUnit(packet.getUnit() != null ? packet.getUnit() : "degC");
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
        return "Temperature Interpreter (v1.0.0)";
    }
}
