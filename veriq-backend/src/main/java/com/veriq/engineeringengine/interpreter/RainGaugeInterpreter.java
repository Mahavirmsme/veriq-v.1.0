package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;

@Component
public class RainGaugeInterpreter implements SensorInterpreter {

    @Override
    public boolean supports(String sensorType) {
        return sensorType != null && sensorType.toLowerCase().contains("rain");
    }

    @Override
    public EngineeringObservation interpret(ValidatedTelemetryPacket packet) {
        double val = packet.getValue() != null ? packet.getValue() : 0.0;
        String obsStr;

        if (val <= 0.0) {
            obsStr = "NO_RAIN";
        } else if (val <= 2.5) {
            obsStr = "LIGHT_RAIN";
        } else if (val <= 10.0) {
            obsStr = "MODERATE_RAIN";
        } else {
            obsStr = "HEAVY_RAIN";
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
        return "Rain Gauge Interpreter (v1.0.0)";
    }
}
