package com.veriq.nodestate.mapper;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.engineeringengine.dto.EngineeringObservationDTO;
import com.veriq.mechanism.service.MechanismAssessmentEngine;
import com.veriq.nodehealth.aggregator.ObservationAggregator;
import com.veriq.nodestate.dto.NodeStateDTO;
import com.veriq.nodestate.entity.NodeStateRecord;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class NodeStateMapper {

    private final MechanismAssessmentEngine mechanismAssessmentEngine;
    private final ObservationAggregator observationAggregator;

    public NodeStateMapper(MechanismAssessmentEngine mechanismAssessmentEngine,
                           ObservationAggregator observationAggregator) {
        this.mechanismAssessmentEngine = mechanismAssessmentEngine;
        this.observationAggregator = observationAggregator;
    }

    public NodeStateDTO toDto(NodeStateRecord entity) {
        if (entity == null) {
            return null;
        }
        NodeStateDTO dto = new NodeStateDTO();
        dto.setId(entity.getId());
        UUID nodeId = null;
        if (entity.getEngineeringNode() != null) {
            nodeId = entity.getEngineeringNode().getId();
            dto.setEngineeringNodeId(nodeId);
            dto.setNodeCode(entity.getEngineeringNode().getNodeCode());
            dto.setNodeNumber(entity.getEngineeringNode().getNodeNumber());
        }
        dto.setCurrentHealth(entity.getCurrentHealth());
        dto.setPreviousHealth(entity.getPreviousHealth());
        dto.setEvaluationVersion(entity.getEvaluationVersion());
        dto.setObservationCount(entity.getObservationCount());
        dto.setEvaluationTimestamp(entity.getEvaluationTimestamp());
        dto.setHealthSource(entity.getHealthSource());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        if (nodeId != null) {
            populateObservations(dto, nodeId);
            if (mechanismAssessmentEngine != null) {
                com.veriq.nodehealth.dto.NodeSnapshot snapshot = new com.veriq.nodehealth.dto.NodeSnapshot();
                snapshot.setEngineeringNodeId(nodeId);
                snapshot.setNodeCode(dto.getNodeCode());
                if (observationAggregator != null && observationAggregator.getNodeCache().containsKey(nodeId)) {
                    snapshot.setObservations(observationAggregator.getNodeCache().get(nodeId));
                }
                dto.setMechanisms(mechanismAssessmentEngine.evaluateNodeMechanisms(snapshot));
            }
        } else if (mechanismAssessmentEngine != null) {
            dto.setMechanisms(mechanismAssessmentEngine.getUnEvaluatedAssessmentsForNode(null));
        }

        return dto;
    }

    public void populateObservations(NodeStateDTO dto, UUID nodeId) {
        if (dto == null || nodeId == null || observationAggregator == null) {
            return;
        }
        Map<UUID, Map<String, EngineeringObservation>> cache = observationAggregator.getNodeCache();
        Map<String, EngineeringObservation> sensorMap = cache.get(nodeId);
        if (sensorMap != null && !sensorMap.isEmpty()) {
            List<EngineeringObservationDTO> obsList = sensorMap.values().stream()
                    .map(this::toObservationDto)
                    .collect(Collectors.toList());
            dto.setObservations(obsList);
            dto.setObservationCount(obsList.size());
        }
    }

    public EngineeringObservationDTO toObservationDto(EngineeringObservation obs) {
        if (obs == null) {
            return null;
        }
        EngineeringObservationDTO dto = new EngineeringObservationDTO();
        dto.setObservationId(obs.getObservationId());
        dto.setRuntimeSensorId(obs.getRuntimeSensorId());
        dto.setSensorCode(obs.getSensorCode());
        dto.setSensorType(obs.getSensorType());
        dto.setMeasuredValue(obs.getMeasuredValue());
        dto.setUnit(obs.getUnit());
        dto.setObservation(obs.getObservation());
        dto.setConfidence(obs.getConfidence());
        dto.setInterpreterName(obs.getInterpreterName());
        dto.setInterpreterVersion(obs.getInterpreterVersion());
        dto.setStatus(obs.getStatus());
        dto.setReason(obs.getReason());
        dto.setObservationTimestamp(obs.getObservationTimestamp());
        return dto;
    }
}
