package com.veriq.runtimeservicemanager.provider;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.runtimeservicemanager.dto.SensorReadingData;

public interface SensorProvider {

    SensorReadingData generateReading(RuntimeSensor sensor);

    String getProviderName();
}
