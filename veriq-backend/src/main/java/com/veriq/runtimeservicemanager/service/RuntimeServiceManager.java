package com.veriq.runtimeservicemanager.service;

import com.veriq.runtimeservicemanager.dto.RuntimeServiceManagerStatusDTO;
import com.veriq.runtimeservicemanager.dto.TelemetryPacket;

import java.util.List;

public interface RuntimeServiceManager {

    RuntimeServiceManagerStatusDTO getStatus();

    void startService();

    void pauseService();

    List<TelemetryPacket> triggerManualCycle();
}
