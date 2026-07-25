package com.veriq.engineeringengine.service;

import com.veriq.engineeringengine.dto.EngineeringEngineMetricsDTO;
import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;

public interface EngineeringEngineService {

    EngineeringObservation processTelemetry(ValidatedTelemetryPacket packet);

    EngineeringEngineMetricsDTO getDiagnosticsMetrics();
}
