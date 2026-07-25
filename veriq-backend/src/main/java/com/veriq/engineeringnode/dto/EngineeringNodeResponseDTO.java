package com.veriq.engineeringnode.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public class EngineeringNodeResponseDTO {

    private UUID id;
    private UUID deploymentZoneId;
    private String zoneCode;
    private String zoneName;
    private String regionCode;
    private String nodeCode;
    private Integer nodeNumber;
    private BigDecimal chainage;
    private String formattedChainage;
    private String generationStatus;
    private String engineeringStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime updatedAt;

    public EngineeringNodeResponseDTO() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeploymentZoneId() {
        return deploymentZoneId;
    }

    public void setDeploymentZoneId(UUID deploymentZoneId) {
        this.deploymentZoneId = deploymentZoneId;
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

    public String getRegionCode() {
        return regionCode;
    }

    public void setRegionCode(String regionCode) {
        this.regionCode = regionCode;
    }

    public String getNodeCode() {
        return nodeCode;
    }

    public void setNodeCode(String nodeCode) {
        this.nodeCode = nodeCode;
    }

    public Integer getNodeNumber() {
        return nodeNumber;
    }

    public void setNodeNumber(Integer nodeNumber) {
        this.nodeNumber = nodeNumber;
    }

    public BigDecimal getChainage() {
        return chainage;
    }

    public void setChainage(BigDecimal chainage) {
        this.chainage = chainage;
    }

    public String getFormattedChainage() {
        return formattedChainage;
    }

    public void setFormattedChainage(String formattedChainage) {
        this.formattedChainage = formattedChainage;
    }

    public String getGenerationStatus() {
        return generationStatus;
    }

    public void setGenerationStatus(String generationStatus) {
        this.generationStatus = generationStatus;
    }

    public String getEngineeringStatus() {
        return engineeringStatus;
    }

    public void setEngineeringStatus(String engineeringStatus) {
        this.engineeringStatus = engineeringStatus;
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
