package com.veriq.telemetry.service;

import com.veriq.runtimeservicemanager.dto.TelemetryPacket;
import com.veriq.telemetry.dto.StandardTelemetryPacket;
import com.veriq.telemetry.dto.TelemetryMetricsDTO;

public interface TelemetryService {

    StandardTelemetryPacket processAndTransport(TelemetryPacket rawPacket);

    TelemetryMetricsDTO getDiagnosticsMetrics();
}
