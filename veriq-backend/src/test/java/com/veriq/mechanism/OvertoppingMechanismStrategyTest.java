package com.veriq.mechanism;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.mechanism.strategy.OvertoppingMechanismStrategy;
import com.veriq.nodehealth.dto.NodeSnapshot;
import com.veriq.specification.entity.AssetEngineeringSpecification;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

public class OvertoppingMechanismStrategyTest {

    private OvertoppingMechanismStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new OvertoppingMechanismStrategy();
    }

    private NodeSnapshot createSnapshot(Double waterLevelValue, String unit) {
        NodeSnapshot snapshot = new NodeSnapshot();
        snapshot.setEngineeringNodeId(UUID.randomUUID());
        snapshot.setNodeCode("NODE-001");

        if (waterLevelValue != null) {
            EngineeringObservation obs = new EngineeringObservation();
            obs.setRuntimeSensorId(UUID.randomUUID());
            obs.setSensorCode("WL-0001");
            obs.setSensorType("Water Level");
            obs.setMeasuredValue(waterLevelValue);
            obs.setUnit(unit);
            obs.setObservation("NORMAL_LEVEL");
            snapshot.addObservation("Water Level", obs);
        }
        return snapshot;
    }

    private AssetEngineeringSpecification createSpec(BigDecimal crest, BigDecimal freeboardMin, boolean datumVerified) {
        AssetEngineeringSpecification spec = new AssetEngineeringSpecification();
        spec.setId(UUID.randomUUID());
        spec.setSpecificationName("Standard Dam Spec");
        spec.setCrestElevation(crest);
        spec.setFreeboardMinimum(freeboardMin);
        if (datumVerified) {
            spec.setSourceDocument("PROJECT_SPEC_V1_DATUM_VERIFIED_MSL");
        } else {
            spec.setSourceDocument("UNVERIFIED_DOC");
        }
        return spec;
    }

    @Test
    @DisplayName("TEST 1: Valid Adequate Freeboard Margin produces STABLE status")
    void testValidStableFreeboard() {
        NodeSnapshot snapshot = createSnapshot(45.0, "m");
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(MechanismType.OVERTOPPING, dto.getMechanismType());
        assertEquals(AssessmentStatus.EVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("STABLE"));
        assertTrue(dto.getEvaluationMessage().contains("Adequate Freeboard Margin"));
    }

    @Test
    @DisplayName("TEST 2: Freeboard Deficit produces WARNING status")
    void testFreeboardDeficitWarning() {
        NodeSnapshot snapshot = createSnapshot(48.5, "m"); // F = 50.0 - 48.5 = 1.5m < Fmin (2.0m)
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.EVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("WARNING"));
        assertTrue(dto.getEvaluationMessage().contains("Freeboard Deficit"));
    }

    @Test
    @DisplayName("TEST 3: Active Overtopping Hazard produces CRITICAL status")
    void testActiveOvertoppingCritical() {
        NodeSnapshot snapshot = createSnapshot(50.5, "m"); // F = 50.0 - 50.5 = -0.5m <= 0
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.EVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("CRITICAL"));
        assertTrue(dto.getEvaluationMessage().contains("Active Overtopping Hazard"));
    }

    @Test
    @DisplayName("TEST 4: Null Crest Elevation produces UNEVALUATED status")
    void testNullCrestElevation() {
        NodeSnapshot snapshot = createSnapshot(45.0, "m");
        AssetEngineeringSpecification spec = createSpec(null, new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("crest elevation is not configured"));
    }

    @Test
    @DisplayName("TEST 5: Null Minimum Freeboard produces UNEVALUATED status")
    void testNullMinimumFreeboard() {
        NodeSnapshot snapshot = createSnapshot(45.0, "m");
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), null, true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("minimum freeboard is not configured"));
    }

    @Test
    @DisplayName("TEST 6: Null / Missing Water Level observation produces UNEVALUATED status")
    void testMissingWaterLevelObservation() {
        NodeSnapshot snapshot = createSnapshot(null, "m");
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("Water Level observation is missing"));
    }

    @Test
    @DisplayName("TEST 7: Incompatible or Missing Unit produces UNEVALUATED status")
    void testIncompatibleUnit() {
        NodeSnapshot snapshot = createSnapshot(45.0, "kPa");
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), true);

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("dimensionally incompatible"));
    }

    @Test
    @DisplayName("TEST 8: Unverified Datum Safety produces UNEVALUATED status")
    void testUnverifiedDatumSafety() {
        NodeSnapshot snapshot = createSnapshot(45.0, "m");
        AssetEngineeringSpecification spec = createSpec(new BigDecimal("50.0"), new BigDecimal("2.0"), false); // datumVerified = false

        MechanismAssessmentDTO dto = strategy.evaluate(snapshot, spec);
        assertNotNull(dto);
        assertEquals(AssessmentStatus.UNEVALUATED, dto.getStatus());
        assertTrue(dto.getEvaluationMessage().contains("vertical datum compatibility"));
    }
}
