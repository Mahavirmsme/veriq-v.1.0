package com.veriq.nodestate.mapper;

import com.veriq.nodestate.dto.NodeStateDTO;
import com.veriq.nodestate.entity.NodeStateRecord;
import org.springframework.stereotype.Component;

@Component
public class NodeStateMapper {

    public NodeStateDTO toDto(NodeStateRecord entity) {
        if (entity == null) {
            return null;
        }
        NodeStateDTO dto = new NodeStateDTO();
        dto.setId(entity.getId());
        if (entity.getEngineeringNode() != null) {
            dto.setEngineeringNodeId(entity.getEngineeringNode().getId());
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
        return dto;
    }
}
