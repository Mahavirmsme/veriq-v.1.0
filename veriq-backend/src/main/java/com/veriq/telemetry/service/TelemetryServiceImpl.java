package com.veriq.telemetry.service;

import com.veriq.runtimeservicemanager.dto.TelemetryPacket;
import com.veriq.telemetry.dto.StandardTelemetryPacket;
import com.veriq.telemetry.dto.TelemetryMetricsDTO;
import com.veriq.telemetry.validation.TelemetryValidationService;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class TelemetryServiceImpl implements TelemetryService {

    private final TelemetryValidationService telemetryValidationService;

    private final AtomicLong globalSequenceCounter = new AtomicLong(0);
    private final AtomicLong totalPacketsReceived = new AtomicLong(0);
    private final AtomicLong totalPacketsForwarded = new AtomicLong(0);

    private volatile OffsetDateTime lastPacketTimestamp;
    private volatile String lastSensorCode;
    private volatile String lastSensorType;
    private volatile Double lastMeasuredValue;
    private volatile String lastUnit;

    public TelemetryServiceImpl(TelemetryValidationService telemetryValidationService) {
        this.telemetryValidationService = telemetryValidationService;
    }

    @Override
    public StandardTelemetryPacket processAndTransport(TelemetryPacket rawPacket) {
        if (rawPacket == null) {
            return null;
        }

        totalPacketsReceived.incrementAndGet();

        StandardTelemetryPacket standardPacket = new StandardTelemetryPacket();
        standardPacket.setRuntimeSensorId(rawPacket.getRuntimeSensorId());
        standardPacket.setSensorCode(rawPacket.getSensorCode());
        standardPacket.setSensorType(rawPacket.getSensorType());
        standardPacket.setSourceTimestamp(rawPacket.getTimestamp() != null ? rawPacket.getTimestamp() : OffsetDateTime.now());
        
        // System Assigned Transport Attributes
        standardPacket.setReceivedTimestamp(OffsetDateTime.now());
        standardPacket.setSequenceNumber(globalSequenceCounter.incrementAndGet());

        standardPacket.setValue(rawPacket.getValue());
        standardPacket.setUnit(rawPacket.getUnit());
        standardPacket.setQuality(rawPacket.getQuality() != null ? rawPacket.getQuality() : "GOOD");
        standardPacket.setProvider("Simulator Provider");

        // Update Diagnostics Metrics
        this.lastPacketTimestamp = standardPacket.getReceivedTimestamp();
        this.lastSensorCode = standardPacket.getSensorCode();
        this.lastSensorType = standardPacket.getSensorType();
        this.lastMeasuredValue = standardPacket.getValue();
        this.lastUnit = standardPacket.getUnit();

        // Forward reliably to Telemetry Validation Layer
        if (telemetryValidationService != null) {
            telemetryValidationService.receiveForValidation(standardPacket);
            totalPacketsForwarded.incrementAndGet();
        }

        return standardPacket;
    }

    @Override
    public TelemetryMetricsDTO getDiagnosticsMetrics() {
        TelemetryMetricsDTO dto = new TelemetryMetricsDTO();
        dto.setTotalPacketsReceived(totalPacketsReceived.get());
        dto.setTotalPacketsForwarded(totalPacketsForwarded.get());
        dto.setGlobalSequenceCounter(globalSequenceCounter.get());
        dto.setLastPacketTimestamp(lastPacketTimestamp);
        dto.setLastSensorCode(lastSensorCode);
        dto.setLastSensorType(lastSensorType);
        dto.setLastMeasuredValue(lastMeasuredValue);
        dto.setLastUnit(lastUnit);
        return dto;
    }
}
