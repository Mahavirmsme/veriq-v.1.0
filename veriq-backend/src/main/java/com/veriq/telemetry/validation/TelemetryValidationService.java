package com.veriq.telemetry.validation;

import com.veriq.telemetry.dto.StandardTelemetryPacket;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import com.veriq.telemetry.dto.ValidationMetricsDTO;

public interface TelemetryValidationService {

    ValidatedTelemetryPacket receiveForValidation(StandardTelemetryPacket packet);

    ValidationMetricsDTO getValidationMetrics();
}
