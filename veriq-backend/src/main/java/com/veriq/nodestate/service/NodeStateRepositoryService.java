package com.veriq.nodestate.service;

import com.veriq.nodehealth.dto.NodeHealthOutput;
import com.veriq.nodestate.dto.NodeStateDTO;

import java.util.List;
import java.util.UUID;

public interface NodeStateRepositoryService {

    NodeStateDTO storeEvaluatedNodeHealth(NodeHealthOutput healthOutput);

    NodeStateDTO getLatestNodeState(UUID engineeringNodeId);

    List<NodeStateDTO> getAllNodeStates();
}
