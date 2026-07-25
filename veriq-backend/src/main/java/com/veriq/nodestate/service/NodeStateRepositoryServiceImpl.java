package com.veriq.nodestate.service;

import com.veriq.common.exception.ResourceNotFoundException;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NodeStateRepositoryServiceImpl implements NodeStateRepositoryService {

    private final NodeStateRecordRepository nodeStateRecordRepository;
    private final EngineeringNodeRepository engineeringNodeRepository;
    private final NodeStateMapper nodeStateMapper;
    private final DeploymentZoneHealthEngineService zoneHealthEngineService;

    public NodeStateRepositoryServiceImpl(NodeStateRecordRepository nodeStateRecordRepository,
                                           EngineeringNodeRepository engineeringNodeRepository,
                                           NodeStateMapper nodeStateMapper,
                                           @Lazy DeploymentZoneHealthEngineService zoneHealthEngineService) {
        this.nodeStateRecordRepository = nodeStateRecordRepository;
        this.engineeringNodeRepository = engineeringNodeRepository;
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
        return nodeStateRecordRepository.findByEngineeringNodeId(engineeringNodeId)
                .map(nodeStateMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NodeStateDTO> getAllNodeStates() {
        return nodeStateRecordRepository.findAll().stream()
                .map(nodeStateMapper::toDto)
                .collect(Collectors.toList());
    }
}
