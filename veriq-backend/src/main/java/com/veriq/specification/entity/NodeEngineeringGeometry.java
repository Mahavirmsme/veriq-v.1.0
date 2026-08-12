package com.veriq.specification.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.engineeringnode.entity.EngineeringNode;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "node_engineering_geometry", uniqueConstraints = {
    @UniqueConstraint(name = "uq_spec_node_geometry", columnNames = {"specification_id", "engineering_node_id"})
})
public class NodeEngineeringGeometry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "specification_id", nullable = false)
    private AssetEngineeringSpecification specification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "engineering_node_id", nullable = false)
    private EngineeringNode engineeringNode;

    @Column(name = "piezometer_tip_elevation", precision = 12, scale = 4)
    private BigDecimal piezometerTipElevation;

    @Column(name = "slope_height", precision = 12, scale = 4)
    private BigDecimal slopeHeight;

    @Column(name = "slope_angle", precision = 8, scale = 4)
    private BigDecimal slopeAngle;

    @Column(name = "crest_width", precision = 12, scale = 4)
    private BigDecimal crestWidth;

    @Column(name = "toe_elevation", precision = 12, scale = 4)
    private BigDecimal toeElevation;

    @Column(name = "seepage_path_length", precision = 12, scale = 4)
    private BigDecimal seepagePathLength;

    @Column(name = "foundation_embedment_depth", precision = 12, scale = 4)
    private BigDecimal foundationEmbedmentDepth;

    @Column(name = "sensor_span_distance", precision = 12, scale = 4)
    private BigDecimal sensorSpanDistance;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public NodeEngineeringGeometry() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AssetEngineeringSpecification getSpecification() {
        return specification;
    }

    public void setSpecification(AssetEngineeringSpecification specification) {
        this.specification = specification;
    }

    public EngineeringNode getEngineeringNode() {
        return engineeringNode;
    }

    public void setEngineeringNode(EngineeringNode engineeringNode) {
        this.engineeringNode = engineeringNode;
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
}
