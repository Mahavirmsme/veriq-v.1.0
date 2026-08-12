package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Component;

@Component
public class InternalSeepageMechanismStrategy implements EngineeringMechanismStrategy {

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.INTERNAL_SEEPAGE;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return new MechanismAssessmentDTO(
                MechanismType.INTERNAL_SEEPAGE,
                AssessmentStatus.UNEVALUATED,
                "Internal Seepage model blocked awaiting canonical Darcy hydraulic gradient & phreatic line equation."
        );
    }
}
