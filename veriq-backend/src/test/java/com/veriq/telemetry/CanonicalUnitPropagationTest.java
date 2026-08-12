package com.veriq.telemetry;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.engineeringengine.interpreter.PiezometerInterpreter;
import com.veriq.runtimeservicemanager.dto.SensorReadingData;
import com.veriq.runtimeservicemanager.provider.SimulatedSensorProviderImpl;
import com.veriq.specification.entity.SensorEngineeringBaseline;
import com.veriq.specification.repository.SensorEngineeringBaselineRepository;
import com.veriq.telemetry.dto.ValidatedTelemetryPacket;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class CanonicalUnitPropagationTest {

    private SensorEngineeringBaselineRepository baselineRepository;
    private SimulatedSensorProviderImpl sensorProvider;
    private PiezometerInterpreter piezometerInterpreter;

    @BeforeEach
    void setUp() {
        baselineRepository = Mockito.mock(SensorEngineeringBaselineRepository.class);
        sensorProvider = new SimulatedSensorProviderImpl(baselineRepository);
        piezometerInterpreter = new PiezometerInterpreter();
    }

    @Test
    @DisplayName("Gate 028: Authoritative unit propagates from SensorEngineeringBaseline to Telemetry and Observation")
    void testAuthoritativeUnitPropagation() {
        UUID sensorId = UUID.randomUUID();
        RuntimeSensor sensor = new RuntimeSensor();
        sensor.setId(sensorId);
        sensor.setSensorCode("PZ-0001");
        sensor.setSensorType("Piezometer");
        sensor.setMeasurementParameter("Pore Water Pressure");

        SensorEngineeringBaseline baseline = new SensorEngineeringBaseline();
        baseline.setBaselineUnit("kPa");
        baseline.setParameterType("Pore Water Pressure");

        when(baselineRepository.findFirstByRuntimeSensorId(sensorId)).thenReturn(Optional.of(baseline));

        // 1. Telemetry Generation via SimulatedSensorProviderImpl
        SensorReadingData readingData = sensorProvider.generateReading(sensor);
        assertNotNull(readingData);
        assertEquals("kPa", readingData.getUnit(), "Telemetry reading unit must equal SensorEngineeringBaseline.baselineUnit");

        // 2. Transport & Validation DTO Propagation
        ValidatedTelemetryPacket validatedPacket = new ValidatedTelemetryPacket();
        validatedPacket.setRuntimeSensorId(sensorId);
        validatedPacket.setSensorCode("PZ-0001");
        validatedPacket.setSensorType("Piezometer");
        validatedPacket.setValue(readingData.getCurrentValue());
        validatedPacket.setUnit(readingData.getUnit());

        // 3. Engineering Observation Interpreter Propagation
        EngineeringObservation observation = piezometerInterpreter.interpret(validatedPacket);
        assertNotNull(observation);
        assertEquals("kPa", observation.getUnit(), "EngineeringObservation unit must equal baselineUnit ('kPa')");
        assertEquals(baseline.getBaselineUnit(), readingData.getUnit());
        assertEquals(readingData.getUnit(), observation.getUnit());
    }

    @Test
    @DisplayName("Gate 028 Negative Test: Missing SensorEngineeringBaseline produces NO INVENTED UNIT")
    void testNegativeTestMissingBaseline() {
        UUID unconfiguredSensorId = UUID.randomUUID();
        RuntimeSensor unconfiguredSensor = new RuntimeSensor();
        unconfiguredSensor.setId(unconfiguredSensorId);
        unconfiguredSensor.setSensorCode("PZ-9999");
        unconfiguredSensor.setSensorType("Piezometer");

        when(baselineRepository.findFirstByRuntimeSensorId(unconfiguredSensorId)).thenReturn(Optional.empty());

        // 1. Reading generation without baseline
        SensorReadingData readingData = sensorProvider.generateReading(unconfiguredSensor);
        assertNotNull(readingData);
        assertNull(readingData.getUnit(), "Missing baseline must NOT invent a unit based on sensorType");

        // 2. Transport & Interpreter propagation without baseline
        ValidatedTelemetryPacket validatedPacket = new ValidatedTelemetryPacket();
        validatedPacket.setRuntimeSensorId(unconfiguredSensorId);
        validatedPacket.setSensorCode("PZ-9999");
        validatedPacket.setSensorType("Piezometer");
        validatedPacket.setValue(45.2);
        validatedPacket.setUnit(readingData.getUnit());

        EngineeringObservation observation = piezometerInterpreter.interpret(validatedPacket);
        assertNotNull(observation);
        assertNull(observation.getUnit(), "EngineeringObservation unit must be null when baseline is absent (no invented unit)");
    }
}
