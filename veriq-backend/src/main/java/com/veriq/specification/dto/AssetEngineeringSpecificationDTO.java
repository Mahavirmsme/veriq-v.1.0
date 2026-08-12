package com.veriq.specification.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.specification.model.SpecificationApprovalStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public class AssetEngineeringSpecificationDTO {

    private UUID id;
    private UUID assetId;
    private String specificationName;
    private String specificationVersion;
    private SpecificationApprovalStatus approvalStatus;

    private String sourceDocument;
    private String issuingAuthority;
    private String approvingAuthority;
    private String approvalReference;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime effectiveFrom;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime effectiveTo;

    private BigDecimal cohesionEffective;
    private BigDecimal frictionAngleEffective;
    private BigDecimal soilUnitWeight;
    private BigDecimal saturatedUnitWeight;
    private BigDecimal hydraulicConductivity;
    private BigDecimal criticalHydraulicGradient;

    private BigDecimal crestElevation;
    private BigDecimal freeboardMinimum;

    private BigDecimal fosRequiredNormal;
    private BigDecimal fosRequiredWarning;
    private BigDecimal fosRequiredCritical;
    private BigDecimal designSignificantWaveHeight;
    private BigDecimal designPeakWavePeriod;
    private BigDecimal unsaturatedFrictionAngle;

    private String methodologyReference;
    private String remarks;

    private List<NodeEngineeringGeometryDTO> nodeGeometries;
    private List<SensorEngineeringBaselineDTO> sensorBaselines;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public AssetEngineeringSpecificationDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getAssetId() {
        return assetId;
    }

    public void setAssetId(UUID assetId) {
        this.assetId = assetId;
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

    public List<NodeEngineeringGeometryDTO> getNodeGeometries() {
        return nodeGeometries;
    }

    public void setNodeGeometries(List<NodeEngineeringGeometryDTO> nodeGeometries) {
        this.nodeGeometries = nodeGeometries;
    }

    public List<SensorEngineeringBaselineDTO> getSensorBaselines() {
        return sensorBaselines;
    }

    public void setSensorBaselines(List<SensorEngineeringBaselineDTO> sensorBaselines) {
        this.sensorBaselines = sensorBaselines;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
