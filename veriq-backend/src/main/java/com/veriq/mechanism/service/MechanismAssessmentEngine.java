package com.veriq.mechanism.service;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;

import java.util.List;
import java.util.UUID;

public interface MechanismAssessmentEngine {
    List<MechanismAssessmentDTO> evaluateNodeMechanisms(NodeSnapshot snapshot);
    List<MechanismAssessmentDTO> getUnEvaluatedAssessmentsForNode(UUID engineeringNodeId);
    MechanismAssessmentDTO getUnEvaluatedAssessment(UUID engineeringNodeId, MechanismType mechanismType);
}
