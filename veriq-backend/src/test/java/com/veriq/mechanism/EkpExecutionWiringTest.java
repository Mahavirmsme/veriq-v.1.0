package com.veriq.mechanism;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.mechanism.service.MechanismAssessmentEngine;
import com.veriq.mechanism.service.MechanismAssessmentEngineImpl;
import com.veriq.mechanism.strategy.*;
import com.veriq.nodehealth.dto.NodeHealthOutput;
import com.veriq.nodehealth.dto.NodeSnapshot;
import com.veriq.nodehealth.service.NodeHealthEngineServiceImpl;
import com.veriq.nodestate.service.NodeStateRepositoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

public class EkpExecutionWiringTest {

    private NodeStateRepositoryService nodeStateRepositoryService;
    private MechanismAssessmentEngine mechanismAssessmentEngine;
    private NodeHealthEngineServiceImpl nodeHealthEngineService;

    private List<EngineeringMechanismStrategy> strategies;

    @BeforeEach
    void setUp() {
        nodeStateRepositoryService = Mockito.mock(NodeStateRepositoryService.class);

        strategies = new ArrayList<>();
        strategies.add(new OvertoppingMechanismStrategy());
        strategies.add(new InternalSeepageMechanismStrategy());
        strategies.add(new InternalErosionMechanismStrategy());
        strategies.add(new SlopeInstabilityMechanismStrategy());
        strategies.add(new SettlementMechanismStrategy());
        strategies.add(new ToeErosionMechanismStrategy());
        strategies.add(new RainfallInstabilityMechanismStrategy());

        mechanismAssessmentEngine = Mockito.spy(new MechanismAssessmentEngineImpl(strategies));
        nodeHealthEngineService = new NodeHealthEngineServiceImpl(nodeStateRepositoryService, mechanismAssessmentEngine);
    }

    @Test
    @DisplayName("Gate 030: Telemetry-path NodeSnapshot invokes MechanismAssessmentEngine and executes all 7 EKP strategies")
    void testEkpExecutionWiringOnRuntimePath() {
        UUID nodeId = UUID.randomUUID();
        NodeSnapshot snapshot = new NodeSnapshot();
        snapshot.setEngineeringNodeId(nodeId);
        snapshot.setNodeCode("NODE-001");

        EngineeringObservation obs = new EngineeringObservation();
        obs.setRuntimeSensorId(UUID.randomUUID());
        obs.setSensorCode("PZ-0001");
        obs.setSensorType("Piezometer");
        obs.setMeasuredValue(45.2);
        obs.setUnit("kPa");
        obs.setObservation("NORMAL_PORE_PRESSURE");

        snapshot.addObservation("Piezometer", obs);

        // 1. Process NodeSnapshot via NodeHealthEngineServiceImpl (Runtime path entry point)
        NodeHealthOutput output = nodeHealthEngineService.processNodeSnapshot(snapshot);
        assertNotNull(output);
        assertEquals("STABLE", output.getOverallNodeState());

        // 2. Verify MechanismAssessmentEngine.evaluateNodeMechanisms was invoked on runtime path
        verify(mechanismAssessmentEngine).evaluateNodeMechanisms(snapshot);

        // 3. Verify all 7 EKP strategies returned their current result (AssessmentStatus.UNEVALUATED)
        List<MechanismAssessmentDTO> results = mechanismAssessmentEngine.evaluateNodeMechanisms(snapshot);
        assertEquals(7, results.size(), "All 7 EKP strategies must produce an assessment result");

        for (MechanismAssessmentDTO dto : results) {
            assertNotNull(dto.getMechanismType());
            assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus(), "Existing strategy status must be UNEVALUATED");
            assertNotNull(dto.getEvaluationMessage());
        }

        // 4. Verify existing NodeState persistence behavior is preserved
        verify(nodeStateRepositoryService).storeEvaluatedNodeHealth(output);
    }
}
