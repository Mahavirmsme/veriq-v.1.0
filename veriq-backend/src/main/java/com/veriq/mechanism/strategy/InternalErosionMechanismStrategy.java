package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Component;

@Component
public class InternalErosionMechanismStrategy implements EngineeringMechanismStrategy {

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.INTERNAL_EROSION;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return new MechanismAssessmentDTO(
                MechanismType.INTERNAL_EROSION,
                AssessmentStatus.UNEVALUATED,
                "Internal Erosion/Piping model blocked awaiting canonical critical exit gradient equation."
        );
    }
}
