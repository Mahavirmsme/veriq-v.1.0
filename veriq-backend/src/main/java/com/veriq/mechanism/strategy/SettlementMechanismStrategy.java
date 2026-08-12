package com.veriq.mechanism.strategy;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Component;

@Component
public class SettlementMechanismStrategy implements EngineeringMechanismStrategy {

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.SETTLEMENT;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return new MechanismAssessmentDTO(
                MechanismType.SETTLEMENT,
                AssessmentStatus.UNEVALUATED,
                "Settlement model blocked awaiting canonical 1D Consolidation equation & soil compression index."
        );
    }
}
