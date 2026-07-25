package com.veriq.region.entity;

import com.veriq.asset.entity.Asset;
import com.veriq.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "region")
public class Region extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "region_code", nullable = false, length = 50)
    private String regionCode;

    @Column(name = "region_name", nullable = false, length = 150)
    private String regionName;

    @Column(name = "start_chainage", nullable = false, precision = 12, scale = 3)
    private BigDecimal startChainage;

    @Column(name = "end_chainage", nullable = false, precision = 12, scale = 3)
    private BigDecimal endChainage;

    @Column(name = "region_length", nullable = false, precision = 12, scale = 3)
    private BigDecimal regionLength;

    @Column(name = "region_status", nullable = false, length = 20)
    private String regionStatus = "VALIDATED";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public Region() {}

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

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getRegionName() {
        return regionName;
    }

    public void setRegionName(String regionName) {
        this.regionName = regionName;
    }

    public BigDecimal getStartChainage() {
        return startChainage;
    }

    public void setStartChainage(BigDecimal startChainage) {
        this.startChainage = startChainage;
    }

    public BigDecimal getEndChainage() {
        return endChainage;
    }

    public void setEndChainage(BigDecimal endChainage) {
        this.endChainage = endChainage;
    }

    public BigDecimal getRegionLength() {
        return regionLength;
    }

    public void setRegionLength(BigDecimal regionLength) {
        this.regionLength = regionLength;
    }

    public String getRegionStatus() {
        return regionStatus;
    }

    public void setRegionStatus(String regionStatus) {
        this.regionStatus = regionStatus;
    }
}
