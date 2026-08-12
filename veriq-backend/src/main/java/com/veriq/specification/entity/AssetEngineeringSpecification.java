package com.veriq.specification.entity;

import com.veriq.asset.entity.Asset;
import com.veriq.common.entity.BaseEntity;
import com.veriq.specification.model.SpecificationApprovalStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "asset_engineering_specification", uniqueConstraints = {
    @UniqueConstraint(name = "uq_asset_spec_version", columnNames = {"asset_id", "specification_version"})
})
public class AssetEngineeringSpecification extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "specification_name", nullable = false, length = 150)
    private String specificationName;

    @Column(name = "specification_version", nullable = false, length = 50)
    private String specificationVersion;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 30)
    private SpecificationApprovalStatus approvalStatus = SpecificationApprovalStatus.ASSUMED_TEST;

    @Column(name = "source_document", length = 255)
    private String sourceDocument;

    @Column(name = "issuing_authority", length = 150)
    private String issuingAuthority;

    @Column(name = "approving_authority", length = 150)
    private String approvingAuthority;

    @Column(name = "approval_reference", length = 100)
    private String approvalReference;

    @Column(name = "effective_from")
    private OffsetDateTime effectiveFrom;

    @Column(name = "effective_to")
    private OffsetDateTime effectiveTo;

    @Column(name = "cohesion_effective", precision = 12, scale = 4)
    private BigDecimal cohesionEffective;

    @Column(name = "friction_angle_effective", precision = 12, scale = 4)
    private BigDecimal frictionAngleEffective;

    @Column(name = "soil_unit_weight", precision = 12, scale = 4)
    private BigDecimal soilUnitWeight;

    @Column(name = "saturated_unit_weight", precision = 12, scale = 4)
    private BigDecimal saturatedUnitWeight;

    @Column(name = "hydraulic_conductivity", precision = 16, scale = 8)
    private BigDecimal hydraulicConductivity;

    @Column(name = "critical_hydraulic_gradient", precision = 12, scale = 4)
    private BigDecimal criticalHydraulicGradient;

    @Column(name = "crest_elevation", precision = 12, scale = 4)
    private BigDecimal crestElevation;

    @Column(name = "freeboard_minimum", precision = 12, scale = 4)
    private BigDecimal freeboardMinimum;

    @Column(name = "fos_required_normal", precision = 8, scale = 4)
    private BigDecimal fosRequiredNormal;

    @Column(name = "fos_required_warning", precision = 8, scale = 4)
    private BigDecimal fosRequiredWarning;

    @Column(name = "fos_required_critical", precision = 8, scale = 4)
    private BigDecimal fosRequiredCritical;

    @Column(name = "design_significant_wave_height", precision = 8, scale = 4)
    private BigDecimal designSignificantWaveHeight;

    @Column(name = "design_peak_wave_period", precision = 8, scale = 4)
    private BigDecimal designPeakWavePeriod;

    @Column(name = "unsaturated_friction_angle", precision = 8, scale = 4)
    private BigDecimal unsaturatedFrictionAngle;

    @Column(name = "methodology_reference", length = 255)
    private String methodologyReference;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public AssetEngineeringSpecification() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public String getSpecificationName() {
        return specificationName;
    }

    public void setSpecificationName(String specificationName) {
        this.specificationName = specificationName;
    }

    public String getSpecificationVersion() {
        return specificationVersion;
    }

    public void setSpecificationVersion(String specificationVersion) {
        this.specificationVersion = specificationVersion;
    }

    public SpecificationApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(SpecificationApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getSourceDocument() {
        return sourceDocument;
    }

    public void setSourceDocument(String sourceDocument) {
        this.sourceDocument = sourceDocument;
    }

    public String getIssuingAuthority() {
        return issuingAuthority;
    }

    public void setIssuingAuthority(String issuingAuthority) {
        this.issuingAuthority = issuingAuthority;
    }

    public String getApprovingAuthority() {
        return approvingAuthority;
    }

    public void setApprovingAuthority(String approvingAuthority) {
        this.approvingAuthority = approvingAuthority;
    }

    public String getApprovalReference() {
        return approvalReference;
    }

    public void setApprovalReference(String approvalReference) {
        this.approvalReference = approvalReference;
    }

    public OffsetDateTime getEffectiveFrom() {
        return effectiveFrom;
    }

    public void setEffectiveFrom(OffsetDateTime effectiveFrom) {
        this.effectiveFrom = effectiveFrom;
    }

    public OffsetDateTime getEffectiveTo() {
        return effectiveTo;
    }

    public void setEffectiveTo(OffsetDateTime effectiveTo) {
        this.effectiveTo = effectiveTo;
    }

    public BigDecimal getCohesionEffective() {
        return cohesionEffective;
    }

    public void setCohesionEffective(BigDecimal cohesionEffective) {
        this.cohesionEffective = cohesionEffective;
    }

    public BigDecimal getFrictionAngleEffective() {
        return frictionAngleEffective;
    }

    public void setFrictionAngleEffective(BigDecimal frictionAngleEffective) {
        this.frictionAngleEffective = frictionAngleEffective;
    }

    public BigDecimal getSoilUnitWeight() {
        return soilUnitWeight;
    }

    public void setSoilUnitWeight(BigDecimal soilUnitWeight) {
        this.soilUnitWeight = soilUnitWeight;
    }

    public BigDecimal getSaturatedUnitWeight() {
        return saturatedUnitWeight;
    }

    public void setSaturatedUnitWeight(BigDecimal saturatedUnitWeight) {
        this.saturatedUnitWeight = saturatedUnitWeight;
    }

    public BigDecimal getHydraulicConductivity() {
        return hydraulicConductivity;
    }

    public void setHydraulicConductivity(BigDecimal hydraulicConductivity) {
        this.hydraulicConductivity = hydraulicConductivity;
    }

    public BigDecimal getCriticalHydraulicGradient() {
        return criticalHydraulicGradient;
    }

    public void setCriticalHydraulicGradient(BigDecimal criticalHydraulicGradient) {
        this.criticalHydraulicGradient = criticalHydraulicGradient;
    }

    public BigDecimal getCrestElevation() {
        return crestElevation;
    }

    public void setCrestElevation(BigDecimal crestElevation) {
        this.crestElevation = crestElevation;
    }

    public BigDecimal getFreeboardMinimum() {
        return freeboardMinimum;
    }

    public void setFreeboardMinimum(BigDecimal freeboardMinimum) {
        this.freeboardMinimum = freeboardMinimum;
    }

    public BigDecimal getFosRequiredNormal() {
        return fosRequiredNormal;
    }

    public void setFosRequiredNormal(BigDecimal fosRequiredNormal) {
        this.fosRequiredNormal = fosRequiredNormal;
    }

    public BigDecimal getFosRequiredWarning() {
        return fosRequiredWarning;
    }

    public void setFosRequiredWarning(BigDecimal fosRequiredWarning) {
        this.fosRequiredWarning = fosRequiredWarning;
    }

    public BigDecimal getFosRequiredCritical() {
        return fosRequiredCritical;
    }

    public void setFosRequiredCritical(BigDecimal fosRequiredCritical) {
        this.fosRequiredCritical = fosRequiredCritical;
    }

    public BigDecimal getDesignSignificantWaveHeight() {
        return designSignificantWaveHeight;
    }

    public void setDesignSignificantWaveHeight(BigDecimal designSignificantWaveHeight) {
        this.designSignificantWaveHeight = designSignificantWaveHeight;
    }

    public BigDecimal getDesignPeakWavePeriod() {
        return designPeakWavePeriod;
    }

    public void setDesignPeakWavePeriod(BigDecimal designPeakWavePeriod) {
        this.designPeakWavePeriod = designPeakWavePeriod;
    }

    public BigDecimal getUnsaturatedFrictionAngle() {
        return unsaturatedFrictionAngle;
    }

    public void setUnsaturatedFrictionAngle(BigDecimal unsaturatedFrictionAngle) {
        this.unsaturatedFrictionAngle = unsaturatedFrictionAngle;
    }

    public String getMethodologyReference() {
        return methodologyReference;
    }

    public void setMethodologyReference(String methodologyReference) {
        this.methodologyReference = methodologyReference;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
