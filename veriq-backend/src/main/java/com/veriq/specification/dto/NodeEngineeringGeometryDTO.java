package com.veriq.specification.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class NodeEngineeringGeometryDTO {

    private UUID id;
    private UUID specificationId;
    private UUID engineeringNodeId;
    private String nodeCode;

    private BigDecimal piezometerTipElevation;
    private BigDecimal slopeHeight;
    private BigDecimal slopeAngle;
    private BigDecimal crestWidth;
    private BigDecimal toeElevation;
    private BigDecimal seepagePathLength;
    private BigDecimal foundationEmbedmentDepth;
    private BigDecimal sensorSpanDistance;
    private String remarks;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public NodeEngineeringGeometryDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSpecificationId() {
        return specificationId;
    }

    public void setSpecificationId(UUID specificationId) {
        this.specificationId = specificationId;
    }

    public UUID getEngineeringNodeId() {
        return engineeringNodeId;
    }

    public void setEngineeringNodeId(UUID engineeringNodeId) {
        this.engineeringNodeId = engineeringNodeId;
    }

    public String getNodeCode() {
        return nodeCode;
    }

    public void setNodeCode(String nodeCode) {
        this.nodeCode = nodeCode;
    }

    public BigDecimal getPiezometerTipElevation() {
        return piezometerTipElevation;
    }

    public void setPiezometerTipElevation(BigDecimal piezometerTipElevation) {
        this.piezometerTipElevation = piezometerTipElevation;
    }

    public BigDecimal getSlopeHeight() {
        return slopeHeight;
    }

    public void setSlopeHeight(BigDecimal slopeHeight) {
        this.slopeHeight = slopeHeight;
    }

    public BigDecimal getSlopeAngle() {
        return slopeAngle;
    }

    public void setSlopeAngle(BigDecimal slopeAngle) {
        this.slopeAngle = slopeAngle;
    }

    public BigDecimal getCrestWidth() {
        return crestWidth;
    }

    public void setCrestWidth(BigDecimal crestWidth) {
        this.crestWidth = crestWidth;
    }

    public BigDecimal getToeElevation() {
        return toeElevation;
    }

    public void setToeElevation(BigDecimal toeElevation) {
        this.toeElevation = toeElevation;
    }

    public BigDecimal getSeepagePathLength() {
        return seepagePathLength;
    }

    public void setSeepagePathLength(BigDecimal seepagePathLength) {
        this.seepagePathLength = seepagePathLength;
    }

    public BigDecimal getFoundationEmbedmentDepth() {
        return foundationEmbedmentDepth;
    }

    public void setFoundationEmbedmentDepth(BigDecimal foundationEmbedmentDepth) {
        this.foundationEmbedmentDepth = foundationEmbedmentDepth;
    }

    public BigDecimal getSensorSpanDistance() {
        return sensorSpanDistance;
    }

    public void setSensorSpanDistance(BigDecimal sensorSpanDistance) {
        this.sensorSpanDistance = sensorSpanDistance;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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
