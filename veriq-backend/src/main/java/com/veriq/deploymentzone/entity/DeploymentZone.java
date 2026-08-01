package com.veriq.deploymentzone.entity;

import com.veriq.asset.entity.Asset;
import com.veriq.common.entity.BaseEntity;
import com.veriq.pointasset.entity.PointAsset;
import com.veriq.region.entity.Region;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "deployment_zone")
public class DeploymentZone extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "region_id", nullable = true)
    private Region region;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "asset_id", nullable = true)
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "point_asset_id", nullable = true)
    private PointAsset pointAsset;

    @Column(name = "zone_code", nullable = false, length = 50)
    private String zoneCode;

    @Column(name = "zone_name", nullable = false, length = 150)
    private String zoneName;

    @Column(name = "priority", nullable = false, length = 50)
    private String priority = "High";

    @Column(name = "start_chainage", nullable = false, precision = 12, scale = 3)
    private BigDecimal startChainage;

    @Column(name = "end_chainage", nullable = false, precision = 12, scale = 3)
    private BigDecimal endChainage;

    @Column(name = "zone_length", nullable = false, precision = 12, scale = 3)
    private BigDecimal zoneLength;

    @Column(name = "node_spacing", nullable = false, precision = 10, scale = 2)
    private BigDecimal nodeSpacing;

    @Column(name = "total_nodes", nullable = false)
    private Integer totalNodes;

    @Column(name = "zone_status", nullable = false, length = 20)
    private String zoneStatus = "VALIDATED";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public DeploymentZone() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public PointAsset getPointAsset() {
        return pointAsset;
    }

    public void setPointAsset(PointAsset pointAsset) {
        this.pointAsset = pointAsset;
    }

    public String getZoneCode() {
        return zoneCode;
    }

    public void setZoneCode(String zoneCode) {
        this.zoneCode = zoneCode;
    }

    public String getZoneName() {
        return zoneName;
    }

    public void setZoneName(String zoneName) {
        this.zoneName = zoneName;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
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

    public BigDecimal getZoneLength() {
        return zoneLength;
    }

    public void setZoneLength(BigDecimal zoneLength) {
        this.zoneLength = zoneLength;
    }

    public BigDecimal getNodeSpacing() {
        return nodeSpacing;
    }

    public void setNodeSpacing(BigDecimal nodeSpacing) {
        this.nodeSpacing = nodeSpacing;
    }

    public Integer getTotalNodes() {
        return totalNodes;
    }

    public void setTotalNodes(Integer totalNodes) {
        this.totalNodes = totalNodes;
    }

    public String getZoneStatus() {
        return zoneStatus;
    }

    public void setZoneStatus(String zoneStatus) {
        this.zoneStatus = zoneStatus;
    }
}
