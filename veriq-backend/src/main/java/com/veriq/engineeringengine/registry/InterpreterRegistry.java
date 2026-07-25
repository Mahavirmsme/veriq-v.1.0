package com.veriq.engineeringengine.registry;

import com.veriq.engineeringengine.interpreter.*;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class InterpreterRegistry {

    private final Map<String, SensorInterpreter> registry = new HashMap<>();
    private final GenericInterpreter genericInterpreter;

    public InterpreterRegistry(List<SensorInterpreter> activeInterpreters, GenericInterpreter genericInterpreter) {
        this.genericInterpreter = genericInterpreter;
        registerAllMasterSensors(activeInterpreters);
    }

    private void registerAllMasterSensors(List<SensorInterpreter> activeInterpreters) {
        // Slope Monitoring
        registerSensor("Tilt Sensor", activeInterpreters);
        registerSensor("Inclinometer", activeInterpreters);
        registerSensor("Accelerometer", activeInterpreters);

        // Ground & Soil
        registerSensor("Piezometer", activeInterpreters);
        registerSensor("Soil Moisture Sensor", activeInterpreters);
        registerSensor("Soil Moisture", activeInterpreters);
        registerSensor("Soil Temperature Sensor", activeInterpreters);
        registerSensor("Soil Temperature", activeInterpreters);
        registerSensor("Earth Pressure Cell", activeInterpreters);
        registerSensor("Settlement Marker", activeInterpreters);
        registerSensor("Extensometer", activeInterpreters);
        registerSensor("Crack Meter", activeInterpreters);

        // Structural
        registerSensor("Strain Gauge", activeInterpreters);
        registerSensor("Load Cell", activeInterpreters);
        registerSensor("Vibration Sensor", activeInterpreters);

        // Hydrology
        registerSensor("Water Level Sensor", activeInterpreters);
        registerSensor("Water Level", activeInterpreters);
        registerSensor("River Stage Sensor", activeInterpreters);
        registerSensor("Flow Meter", activeInterpreters);

        // Weather
        registerSensor("Rain Gauge", activeInterpreters);
        registerSensor("Weather Station", activeInterpreters);
        registerSensor("Wind Speed Sensor", activeInterpreters);
        registerSensor("Wind Direction Sensor", activeInterpreters);
        registerSensor("Relative Humidity Sensor", activeInterpreters);
        registerSensor("Atmospheric Pressure Sensor", activeInterpreters);
        registerSensor("Solar Radiation Sensor", activeInterpreters);

        // Advanced
        registerSensor("GNSS / GPS Station", activeInterpreters);
        registerSensor("Fiber Optic DAS", activeInterpreters);
        registerSensor("Fiber Optic DTS", activeInterpreters);
        registerSensor("Acoustic Sensor", activeInterpreters);
        registerSensor("Leakage Detection Sensor", activeInterpreters);

        // Visual
        registerSensor("CCTV Camera", activeInterpreters);
        registerSensor("Thermal Camera", activeInterpreters);

        // Others
        registerSensor("Custom Sensor", activeInterpreters);
    }

    private void registerSensor(String sensorType, List<SensorInterpreter> activeInterpreters) {
        SensorInterpreter matched = activeInterpreters.stream()
                .filter(i -> !(i instanceof GenericInterpreter) && i.supports(sensorType))
                .findFirst()
                .orElse(genericInterpreter);

        registry.put(sensorType.toLowerCase().trim(), matched);
    }

    public SensorInterpreter getInterpreter(String sensorType) {
        if (sensorType == null || sensorType.trim().isEmpty()) {
            return genericInterpreter;
        }

        String key = sensorType.toLowerCase().trim();
        SensorInterpreter interpreter = registry.get(key);
        if (interpreter != null) {
            return interpreter;
        }

        // Partial key fallback search
        for (Map.Entry<String, SensorInterpreter> entry : registry.entrySet()) {
            if (key.contains(entry.getKey()) || entry.getKey().contains(key)) {
                return entry.getValue();
            }
        }

        return genericInterpreter;
    }

    public int getRegisteredSensorTypesCount() {
        return registry.size();
    }
}
