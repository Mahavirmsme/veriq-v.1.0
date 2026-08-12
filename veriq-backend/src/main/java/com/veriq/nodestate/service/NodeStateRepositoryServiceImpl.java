package com.veriq.nodestate.service;

import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.commissioning.entity.CommissioningRecord;
import com.veriq.commissioning.repository.CommissioningRecordRepository;
import com.veriq.deploymentzonehealth.service.DeploymentZoneHealthEngineService;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.engineeringnode.repository.EngineeringNodeRepository;
import com.veriq.nodehealth.dto.NodeHealthOutput;
import com.veriq.nodestate.dto.NodeStateDTO;
import com.veriq.nodestate.entity.NodeStateRecord;
import com.veriq.nodestate.mapper.NodeStateMapper;
import com.veriq.nodestate.repository.NodeStateRecordRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class NodeStateRepositoryServiceImpl implements NodeStateRepositoryService {

    private final NodeStateRecordRepository nodeStateRecordRepository;
    private final EngineeringNodeRepository engineeringNodeRepository;
    private final CommissioningRecordRepository commissioningRecordRepository;
    private final NodeStateMapper nodeStateMapper;
    private final DeploymentZoneHealthEngineService zoneHealthEngineService;

    public NodeStateRepositoryServiceImpl(NodeStateRecordRepository nodeStateRecordRepository,
                                           EngineeringNodeRepository engineeringNodeRepository,
                                           CommissioningRecordRepository commissioningRecordRepository,
                                           NodeStateMapper nodeStateMapper,
                                           @Lazy DeploymentZoneHealthEngineService zoneHealthEngineService) {
        this.nodeStateRecordRepository = nodeStateRecordRepository;
        this.engineeringNodeRepository = engineeringNodeRepository;
        this.commissioningRecordRepository = commissioningRecordRepository;
        this.nodeStateMapper = nodeStateMapper;
        this.zoneHealthEngineService = zoneHealthEngineService;
    }

    @Override
    public NodeStateDTO storeEvaluatedNodeHealth(NodeHealthOutput healthOutput) {
        if (healthOutput == null || healthOutput.getEngineeringNodeId() == null) {
            return null;
        }

        UUID nodeId = healthOutput.getEngineeringNodeId();
        EngineeringNode node = engineeringNodeRepository.findById(nodeId)
                .orElseThrow(() -> new ResourceNotFoundException("EngineeringNode", "id", nodeId));

        Optional<NodeStateRecord> existingOpt = nodeStateRecordRepository.findByEngineeringNodeId(nodeId);
        NodeStateRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            record.setPreviousHealth(record.getCurrentHealth());
            record.setCurrentHealth(healthOutput.getOverallNodeState());
            record.setObservationCount(healthOutput.getObservationCount());
            record.setEvaluationTimestamp(healthOutput.getHealthTimestamp() != null ? healthOutput.getHealthTimestamp() : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
            record.setHealthSource("Node Health Engine");
        } else {
            record = new NodeStateRecord();
            record.setEngineeringNode(node);
            record.setPreviousHealth("NONE");
            record.setCurrentHealth(healthOutput.getOverallNodeState());
            record.setObservationCount(healthOutput.getObservationCount());
            record.setEvaluationTimestamp(healthOutput.getHealthTimestamp() != null ? healthOutput.getHealthTimestamp() : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
            record.setHealthSource("Node Health Engine");
        }

        NodeStateRecord saved = nodeStateRecordRepository.save(record);

        // Trigger Deployment Zone Health Engine aggregation for parent zone
        if (zoneHealthEngineService != null && node.getDeploymentZone() != null) {
            zoneHealthEngineService.evaluateZoneHealth(node.getDeploymentZone().getId());
        }

        return nodeStateMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public NodeStateDTO getLatestNodeState(UUID engineeringNodeId) {
        Optional<NodeStateRecord> recOpt = nodeStateRecordRepository.findByEngineeringNodeId(engineeringNodeId);
        if (recOpt.isPresent()) {
            return nodeStateMapper.toDto(recOpt.get());
        }

        EngineeringNode node = engineeringNodeRepository.findById(engineeringNodeId).orElse(null);
        if (node == null) return null;

        // Exclude uncommissioned / non-active nodes from Operations
        Optional<CommissioningRecord> commOpt = commissioningRecordRepository.findByEngineeringNodeId(engineeringNodeId);
        if (commOpt.isEmpty() || !"COMMISSIONED".equalsIgnoreCase(commOpt.get().getStatus())) {
            return null;
        }

        NodeStateDTO dto = new NodeStateDTO();
        dto.setId(UUID.randomUUID());
        dto.setEngineeringNodeId(node.getId());
        dto.setNodeCode(node.getNodeCode());
        dto.setNodeNumber(node.getNodeNumber());
        dto.setCurrentHealth("STABLE");
        dto.setPreviousHealth("NONE");
        dto.setObservationCount(0);
        dto.setEvaluationVersion("v1.0.0");
        dto.setEvaluationTimestamp(OffsetDateTime.now());
        dto.setHealthSource("ENGINEERING_BASELINE");

        nodeStateMapper.populateObservations(dto, engineeringNodeId);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeStateDTO> getAllNodeStates() {
        // Query nodes that are commissioned & active
        List<CommissioningRecord> commissionedRecords = commissioningRecordRepository.findByStatus("COMMISSIONED");
        Set<UUID> commissionedNodeIds = commissionedRecords.stream()
                .filter(r -> r.getEngineeringNode() != null)
                .map(r -> r.getEngineeringNode().getId())
                .collect(Collectors.toSet());

        Map<UUID, NodeStateRecord> recordMap = nodeStateRecordRepository.findAll().stream()
                .filter(r -> r.getEngineeringNode() != null)
                .collect(Collectors.toMap(r -> r.getEngineeringNode().getId(), r -> r, (r1, r2) -> r1));

        if (commissionedNodeIds.isEmpty()) {
            return Collections.emptyList();
        }

        List<EngineeringNode> activeNodes = engineeringNodeRepository.findAllById(commissionedNodeIds);

        return activeNodes.stream().map(node -> {
            NodeStateRecord rec = recordMap.get(node.getId());
            NodeStateDTO dto;
            if (rec != null) {
                dto = nodeStateMapper.toDto(rec);
            } else {
                dto = new NodeStateDTO();
                dto.setId(UUID.randomUUID());
                dto.setEngineeringNodeId(node.getId());
                dto.setNodeCode(node.getNodeCode());
                dto.setNodeNumber(node.getNodeNumber());
                dto.setCurrentHealth("STABLE");
                dto.setPreviousHealth("NONE");
                dto.setObservationCount(0);
                dto.setEvaluationVersion("v1.0.0");
                dto.setEvaluationTimestamp(OffsetDateTime.now());
                dto.setHealthSource("ENGINEERING_BASELINE");
                nodeStateMapper.populateObservations(dto, node.getId());
            }
            return dto;
        }).collect(Collectors.toList());
    }
}
