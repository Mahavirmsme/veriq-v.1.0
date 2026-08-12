package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;

public interface EngineeringMechanismStrategy {
    MechanismType getMechanismType();
    MechanismAssessmentDTO evaluate(NodeSnapshot snapshot);
}
