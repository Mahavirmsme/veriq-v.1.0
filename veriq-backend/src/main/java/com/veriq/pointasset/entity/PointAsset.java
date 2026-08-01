package com.veriq.pointasset.entity;

import com.veriq.asset.entity.Asset;
import com.veriq.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "point_asset")
public class PointAsset extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "point_asset_code", nullable = false, length = 50)
    private String pointAssetCode;

    @Column(name = "point_asset_name", nullable = false, length = 150)
    private String pointAssetName;

    @Column(name = "point_asset_type", nullable = false, length = 100)
    private String pointAssetType;

    @Column(name = "start_chainage", precision = 12, scale = 3)
    private BigDecimal startChainage;

    @Column(name = "structure_length_meters", precision = 12, scale = 2)
    private BigDecimal structureLengthMeters;

    @Column(name = "end_chainage", precision = 12, scale = 3)
    private BigDecimal endChainage;

    @Column(name = "location_chainage", precision = 12, scale = 3)
    private BigDecimal locationChainage;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public PointAsset() {}

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

    public String getPointAssetCode() {
        return pointAssetCode;
    }

    public void setPointAssetCode(String pointAssetCode) {
        this.pointAssetCode = pointAssetCode;
    }

    public String getPointAssetName() {
        return pointAssetName;
    }

    public void setPointAssetName(String pointAssetName) {
        this.pointAssetName = pointAssetName;
    }

    public String getPointAssetType() {
        return pointAssetType;
    }

    public void setPointAssetType(String pointAssetType) {
        this.pointAssetType = pointAssetType;
    }

    public BigDecimal getStartChainage() {
        return startChainage;
    }

    public void setStartChainage(BigDecimal startChainage) {
        this.startChainage = startChainage;
    }

    public BigDecimal getStructureLengthMeters() {
        return structureLengthMeters;
    }

    public void setStructureLengthMeters(BigDecimal structureLengthMeters) {
        this.structureLengthMeters = structureLengthMeters;
    }

    public BigDecimal getEndChainage() {
        return endChainage;
    }

    public void setEndChainage(BigDecimal endChainage) {
        this.endChainage = endChainage;
    }

    public BigDecimal getLocationChainage() {
        return locationChainage;
    }

    public void setLocationChainage(BigDecimal locationChainage) {
        this.locationChainage = locationChainage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
