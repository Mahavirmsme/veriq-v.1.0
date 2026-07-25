package com.veriq.nodestate.controller;

import com.veriq.common.dto.ApiResponse;
import com.veriq.nodestate.dto.NodeStateDTO;
import com.veriq.nodestate.service.NodeStateRepositoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/node-states")
@CrossOrigin(origins = "*")
public class NodeStateController {

    private final NodeStateRepositoryService nodeStateRepositoryService;

    public NodeStateController(NodeStateRepositoryService nodeStateRepositoryService) {
        this.nodeStateRepositoryService = nodeStateRepositoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NodeStateDTO>>> getAllNodeStates() {
        List<NodeStateDTO> states = nodeStateRepositoryService.getAllNodeStates();
        return ResponseEntity.ok(ApiResponse.success(states, "Latest node health states retrieved from Node State Repository"));
    }

    @GetMapping("/node/{engineeringNodeId}")
    public ResponseEntity<ApiResponse<NodeStateDTO>> getLatestNodeState(@PathVariable UUID engineeringNodeId) {
        NodeStateDTO state = nodeStateRepositoryService.getLatestNodeState(engineeringNodeId);
        return ResponseEntity.ok(ApiResponse.success(state, "Latest node state for engineering node retrieved"));
    }
}
