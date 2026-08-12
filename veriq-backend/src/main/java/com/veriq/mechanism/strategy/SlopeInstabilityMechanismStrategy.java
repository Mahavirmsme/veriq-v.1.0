package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Component;

@Component
public class SlopeInstabilityMechanismStrategy implements EngineeringMechanismStrategy {

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.SLOPE_INSTABILITY;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return new MechanismAssessmentDTO(
                MechanismType.SLOPE_INSTABILITY,
                AssessmentStatus.UNEVALUATED,
                "Slope Instability model blocked awaiting canonical Limit Equilibrium equation & soil material parameters."
        );
    }
}
