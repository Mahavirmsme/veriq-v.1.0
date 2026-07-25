package com.veriq.deploymentzone.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class DeploymentZoneResponseDTO {

    private UUID id;
    private UUID regionId;
    private String zoneCode;
    private String zoneName;
    private String priority;
    private BigDecimal startChainage;
    private BigDecimal endChainage;
    private BigDecimal zoneLength;
    private BigDecimal nodeSpacing;
    private Integer totalNodes;
    private String zoneStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public DeploymentZoneResponseDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRegionId() {
        return regionId;
    }

    public void setRegionId(UUID regionId) {
        this.regionId = regionId;
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
