package com.veriq.runtimeservicemanager.provider;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.runtimeservicemanager.dto.SensorReadingData;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Random;

@Component
public class SimulatedSensorProviderImpl implements SensorProvider {

    private final Random random = new Random();

    @Override
    public SensorReadingData generateReading(RuntimeSensor sensor) {
        SensorReadingData data = new SensorReadingData();
        data.setRuntimeSensorId(sensor.getId());
        data.setSensorCode(sensor.getSensorCode());
        data.setSensorType(sensor.getSensorType());
        data.setTimestamp(OffsetDateTime.now());
        data.setQuality("GOOD");
        data.setCommunicationStatus("CONNECTED");

        String lowerType = sensor.getSensorType() != null ? sensor.getSensorType().toLowerCase() : "";

        if (lowerType.contains("tilt")) {
            data.setCurrentValue(Math.round((0.01 + random.nextDouble() * 0.15) * 100.0) / 100.0);
            data.setUnit("degrees");
        } else if (lowerType.contains("piezo")) {
            data.setCurrentValue(Math.round((45.2 + random.nextDouble() * 5.0) * 100.0) / 100.0);
            data.setUnit("kPa");
        } else if (lowerType.contains("soil moisture")) {
            data.setCurrentValue(Math.round((22.5 + random.nextDouble() * 3.5) * 100.0) / 100.0);
            data.setUnit("% VWC");
        } else if (lowerType.contains("rain")) {
            data.setCurrentValue(Math.round((0.0 + random.nextDouble() * 2.0) * 10.0) / 10.0);
            data.setUnit("mm/hr");
        } else if (lowerType.contains("water level")) {
            data.setCurrentValue(Math.round((3.4 + random.nextDouble() * 0.8) * 100.0) / 100.0);
            data.setUnit("m");
        } else if (lowerType.contains("strain")) {
            data.setCurrentValue(Math.round((120.0 + random.nextDouble() * 25.0) * 10.0) / 10.0);
            data.setUnit("microstrain");
        } else {
            data.setCurrentValue(Math.round((10.0 + random.nextDouble() * 5.0) * 100.0) / 100.0);
            data.setUnit("units");
        }

        return data;
    }

    @Override
    public String getProviderName() {
        return "Simulated Sensor Provider (V1)";
    }
}
