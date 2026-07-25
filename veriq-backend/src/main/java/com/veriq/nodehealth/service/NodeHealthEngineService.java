package com.veriq.nodehealth.service;

import com.veriq.nodehealth.dto.NodeHealthMetricsDTO;
import com.veriq.nodehealth.dto.NodeHealthOutput;
import com.veriq.nodehealth.dto.NodeSnapshot;

public interface NodeHealthEngineService {

    NodeHealthOutput processNodeSnapshot(NodeSnapshot snapshot);

    NodeHealthMetricsDTO getDiagnosticsMetrics();
}
