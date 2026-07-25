package com.veriq.engineeringengine.interpreter;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;

public interface SensorInterpreter {

    boolean supports(String sensorType);

    EngineeringObservation interpret(ValidatedTelemetryPacket packet);

    String getInterpreterName();
}
