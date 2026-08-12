package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class HumidityInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return sensorType != null && (sensorType.toLowerCase().contains("moisture") || sensorType.toLowerCase().contains("humidity"));
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet.getValue() != null ? packet.getValue() : 0.0;
        String obsStr;

        if (val < 15.0) {
            obsStr = "DRY_SOIL_MOISTURE";
        } else if (val <= 45.0) {
            obsStr = "NORMAL_SOIL_MOISTURE";
        } else {
            obsStr = "SATURATED_SOIL_MOISTURE";
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
        return "Soil Moisture & Humidity Interpreter (v1.0.0)";
    }
}
