package com.veriq.engineeringnode.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class EngineeringNodeItemDTO {

    @NotBlank(message = "Node code is required")
    private String nodeCode;

    @NotNull(message = "Node number is required")
    private Integer nodeNumber;

    @NotNull(message = "Chainage is required")
    private BigDecimal chainage;

    public EngineeringNodeItemDTO() {}

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
}
