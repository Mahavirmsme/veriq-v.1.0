package com.veriq.region.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RegionItemDTO {

    @NotBlank(message = "Region code is required")
    private String regionCode;

    @NotBlank(message = "Region name is required")
    private String regionName;

    @NotNull(message = "Start chainage is required")
    private BigDecimal startChainage;

    @NotNull(message = "End chainage is required")
    private BigDecimal endChainage;

    public RegionItemDTO() {}

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
}
