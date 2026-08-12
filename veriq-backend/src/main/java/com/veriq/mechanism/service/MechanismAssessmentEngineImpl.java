package com.veriq.mechanism.service;

import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.mechanism.strategy.EngineeringMechanismStrategy;
import com.veriq.nodehealth.dto.NodeSnapshot;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MechanismAssessmentEngineImpl implements MechanismAssessmentEngine {

    private final Map<MechanismType, EngineeringMechanismStrategy> strategyMap = new EnumMap<>(MechanismType.class);

    public MechanismAssessmentEngineImpl(List<EngineeringMechanismStrategy> strategies) {
        if (strategies != null) {
            for (EngineeringMechanismStrategy strategy : strategies) {
                strategyMap.put(strategy.getMechanismType(), strategy);
            }
        }
    }

    @Override
    public List<MechanismAssessmentDTO> evaluateNodeMechanisms(NodeSnapshot snapshot) {
        if (snapshot == null) {
            return getUnEvaluatedAssessmentsForNode(null);
        }
        List<MechanismAssessmentDTO> results = new ArrayList<>();
        for (MechanismType type : MechanismType.values()) {
            EngineeringMechanismStrategy strategy = strategyMap.get(type);
            if (strategy != null) {
                results.add(strategy.evaluate(snapshot));
            } else {
                results.add(MechanismAssessmentDTO.unEvaluated(type));
            }
        }
        return results;
    }

    @Override
    public List<MechanismAssessmentDTO> getUnEvaluatedAssessmentsForNode(UUID engineeringNodeId) {
        return Arrays.stream(MechanismType.values())
                .map(MechanismAssessmentDTO::unEvaluated)
                .collect(Collectors.toList());
    }

    @Override
    public MechanismAssessmentDTO getUnEvaluatedAssessment(UUID engineeringNodeId, MechanismType mechanismType) {
        return MechanismAssessmentDTO.unEvaluated(mechanismType);
    }
}
