package com.veriq.mechanism.strategy;

import com.veriq.engineeringengine.dto.EngineeringObservation;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.engineeringnode.repository.EngineeringNodeRepository;
import com.veriq.mechanism.dto.MechanismAssessmentDTO;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;
import com.veriq.nodehealth.dto.NodeSnapshot;
import com.veriq.specification.entity.AssetEngineeringSpecification;
import com.veriq.specification.model.SpecificationApprovalStatus;
import com.veriq.specification.repository.AssetEngineeringSpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class OvertoppingMechanismStrategy implements EngineeringMechanismStrategy {

    private final EngineeringNodeRepository nodeRepository;
    private final AssetEngineeringSpecificationRepository specificationRepository;

    @Autowired
    public OvertoppingMechanismStrategy(Optional<EngineeringNodeRepository> nodeRepository,
                                         Optional<AssetEngineeringSpecificationRepository> specificationRepository) {
        this.nodeRepository = nodeRepository.orElse(null);
        this.specificationRepository = specificationRepository.orElse(null);
    }

    public OvertoppingMechanismStrategy() {
        this.nodeRepository = null;
        this.specificationRepository = null;
    }

    @Override
    public MechanismType getMechanismType() {
        return MechanismType.OVERTOPPING;
    }

    @Override
    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot) {
        return evaluate(snapshot, null);
    }

    public MechanismAssessmentDTO evaluate(NodeSnapshot snapshot, AssetEngineeringSpecification overrideSpec) {
        if (snapshot == null || snapshot.getEngineeringNodeId() == null) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: missing engineering node context."
            );
        }

        // 1. Water Level Input Observation Validation
        EngineeringObservation waterObs = snapshot.getObservationForType("Water Level");
        if (waterObs == null || waterObs.getMeasuredValue() == null) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: Water Level observation is missing or unmeasured."
            );
        }

        // 2. Unit Validation (Frozen Unit Architecture requires 'm')
        String unit = waterObs.getUnit();
        if (unit == null || unit.trim().isEmpty() || !unit.trim().equalsIgnoreCase("m")) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: Water Level unit missing or dimensionally incompatible (" + unit + "). Required unit: m."
            );
        }

        // 3. Resolve Active Specification
        AssetEngineeringSpecification activeSpec = overrideSpec;
        if (activeSpec == null && nodeRepository != null && specificationRepository != null) {
            Optional<EngineeringNode> nodeOpt = nodeRepository.findById(snapshot.getEngineeringNodeId());
            if (nodeOpt.isPresent() && nodeOpt.get().getDeploymentZone() != null && nodeOpt.get().getDeploymentZone().getAsset() != null) {
                UUID assetId = nodeOpt.get().getDeploymentZone().getAsset().getId();
                List<AssetEngineeringSpecification> specs = specificationRepository.findByAssetIdAndApprovalStatus(assetId, SpecificationApprovalStatus.APPROVED);
                if (specs == null || specs.isEmpty()) {
                    specs = specificationRepository.findByAssetId(assetId);
                }
                if (specs != null && !specs.isEmpty()) {
                    activeSpec = specs.get(0);
                }
            }
        }

        if (activeSpec == null) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: active asset engineering specification is unconfigured or not found."
            );
        }

        // 4. Crest Elevation Validation
        BigDecimal crestElevation = activeSpec.getCrestElevation();
        if (crestElevation == null) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: crest elevation is not configured in the active engineering specification."
            );
        }

        // 5. Minimum Freeboard Validation
        BigDecimal freeboardMinimum = activeSpec.getFreeboardMinimum();
        if (freeboardMinimum == null) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: minimum freeboard is not configured in the active engineering specification."
            );
        }

        // 6. Datum Safety Verification
        boolean datumVerified = activeSpec.getSourceDocument() != null && activeSpec.getSourceDocument().toUpperCase().contains("DATUM_VERIFIED");
        if (!datumVerified) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.UNEVALUATED,
                    "Overtopping assessment blocked: vertical datum compatibility between water surface elevation and crest elevation is not verified."
            );
        }

        // 7. Canonical Freeboard Calculation: F = Zcrest - Zwater
        double zCrest = crestElevation.doubleValue();
        double zWater = waterObs.getMeasuredValue();
        double fMin = freeboardMinimum.doubleValue();

        double availableFreeboard = zCrest - zWater;

        // 8. Assessment Status Classification & Message Encoding
        if (availableFreeboard <= 0.0) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.EVALUATED,
                    "CRITICAL: Active Overtopping Hazard: Water level exceeds crest elevation"
            );
        } else if (availableFreeboard < fMin) {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.EVALUATED,
                    "WARNING: Freeboard Deficit: Available freeboard below required minimum buffer"
            );
        } else {
            return new MechanismAssessmentDTO(
                    MechanismType.OVERTOPPING,
                    AssessmentStatus.EVALUATED,
                    "STABLE: Adequate Freeboard Margin"
            );
        }
    }
}
