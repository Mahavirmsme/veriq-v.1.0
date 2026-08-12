package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Component;

@Component
public class ToeErosionMechanismStrategy implements EngineeringMechanismStrategy {

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.TOE_EROSION;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return new MechanismAssessmentDTO(
                MechanismType.TOE_EROSION,
                AssessmentStatus.UNEVALUATED,
                "Toe Erosion model blocked awaiting canonical hydrodynamic shear stress equation & riprap d50 specification."
        );
    }
}
