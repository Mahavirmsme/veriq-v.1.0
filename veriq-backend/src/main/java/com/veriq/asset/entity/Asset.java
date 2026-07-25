package com.veriq.asset.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.project.entity.Project;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "asset")
public class Asset extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "asset_name", nullable = false, length = 150)
    private String assetName;

    @Column(name = "asset_code", nullable = false, unique = true, length = 50)
    private String assetCode;

    @Column(name = "asset_description", columnDefinition = "TEXT")
    private String assetDescription;

    @Column(name = "asset_class", nullable = false, length = 100)
    private String assetClass;

    @Column(name = "asset_nature", nullable = false, length = 20)
    private String assetNature;

    @Column(name = "start_chainage", precision = 12, scale = 3)
    private BigDecimal startChainage;

    @Column(name = "end_chainage", precision = 12, scale = 3)
    private BigDecimal endChainage;

    @Column(name = "total_length", precision = 12, scale = 3)
    private BigDecimal totalLength;

    @Column(name = "asset_status", nullable = false, length = 20)
    private String assetStatus = "ACTIVE";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public Asset() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public String getAssetCode() {
        return assetCode;
    }

    public void setAssetCode(String assetCode) {
        this.assetCode = assetCode;
    }

    public String getAssetDescription() {
        return assetDescription;
    }

    public void setAssetDescription(String assetDescription) {
        this.assetDescription = assetDescription;
    }

    public String getAssetClass() {
        return assetClass;
    }

    public void setAssetClass(String assetClass) {
        this.assetClass = assetClass;
    }

    public String getAssetNature() {
        return assetNature;
    }

    public void setAssetNature(String assetNature) {
        this.assetNature = assetNature;
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

    public BigDecimal getTotalLength() {
        return totalLength;
    }

    public void setTotalLength(BigDecimal totalLength) {
        this.totalLength = totalLength;
    }

    public String getAssetStatus() {
        return assetStatus;
    }

    public void setAssetStatus(String assetStatus) {
        this.assetStatus = assetStatus;
    }
}
