package com.veriq.deploymentzone.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class DeploymentZoneItemDTO {

    @NotBlank(message = "Zone code is required")
    private String zoneCode;

    @NotBlank(message = "Zone name is required")
    private String zoneName;

    @NotBlank(message = "Priority is required")
    private String priority = "High";

    @NotNull(message = "Start chainage is required")
    private BigDecimal startChainage;

    @NotNull(message = "End chainage is required")
    private BigDecimal endChainage;

    @NotNull(message = "Node spacing is required")
    private BigDecimal nodeSpacing;

    public DeploymentZoneItemDTO() {}

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

    public BigDecimal getNodeSpacing() {
        return nodeSpacing;
    }

    public void setNodeSpacing(BigDecimal nodeSpacing) {
        this.nodeSpacing = nodeSpacing;
    }
}
