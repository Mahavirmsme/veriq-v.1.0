package com.veriq.runtimeservicemanager.provider;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.runtimeservicemanager.dto.SensorReadingData;
import com.veriq.specification.entity.SensorEngineeringBaseline;
import com.veriq.specification.repository.SensorEngineeringBaselineRepository;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class SimulatedSensorProviderImpl implements SensorProvider {

    private final Random random = new Random();
    private final SensorEngineeringBaselineRepository sensorBaselineRepository;

    public SimulatedSensorProviderImpl(SensorEngineeringBaselineRepository sensorBaselineRepository) {
        this.sensorBaselineRepository = sensorBaselineRepository;
    }

    @Override
    public SensorReadingData generateReading(RuntimeSensor sensor) {
        SensorReadingData data = new SensorReadingData();
        data.setRuntimeSensorId(sensor.getId());
        data.setSensorCode(sensor.getSensorCode());
        data.setSensorType(sensor.getSensorType());
        data.setTimestamp(OffsetDateTime.now());
        data.setQuality("GOOD");
        data.setCommunicationStatus("CONNECTED");

        // Authoritative Engineering Unit resolution via SensorEngineeringBaseline
        if (sensor != null && sensor.getId() != null) {
            Optional<SensorEngineeringBaseline> baselineOpt = sensorBaselineRepository.findFirstByRuntimeSensorId(sensor.getId());
            if (baselineOpt.isPresent() && baselineOpt.get().getBaselineUnit() != null && !baselineOpt.get().getBaselineUnit().trim().isEmpty()) {
                data.setUnit(baselineOpt.get().getBaselineUnit().trim());
            } else {
                // NO INVENTED UNIT when authoritative baseline is unconfigured or missing
                data.setUnit(null);
            }
        } else {
            data.setUnit(null);
        }

        String lowerType = sensor.getSensorType() != null ? sensor.getSensorType().toLowerCase() : "";

        if (lowerType.contains("tilt")) {
            data.setCurrentValue(Math.round((0.01 + random.nextDouble() * 0.15) * 100.0) / 100.0);
        } else if (lowerType.contains("piezo")) {
            data.setCurrentValue(Math.round((45.2 + random.nextDouble() * 5.0) * 100.0) / 100.0);
        } else if (lowerType.contains("soil moisture")) {
            data.setCurrentValue(Math.round((22.5 + random.nextDouble() * 3.5) * 100.0) / 100.0);
        } else if (lowerType.contains("rain")) {
            data.setCurrentValue(Math.round((0.0 + random.nextDouble() * 2.0) * 10.0) / 10.0);
        } else if (lowerType.contains("water level")) {
            data.setCurrentValue(Math.round((3.4 + random.nextDouble() * 0.8) * 100.0) / 100.0);
        } else if (lowerType.contains("strain")) {
            data.setCurrentValue(Math.round((120.0 + random.nextDouble() * 25.0) * 10.0) / 10.0);
        } else {
            data.setCurrentValue(Math.round((10.0 + random.nextDouble() * 5.0) * 100.0) / 100.0);
        }

        return data;
    }

    @Override
    public String getProviderName() {
        return "Simulated Sensor Provider (V1)";
    }
}
