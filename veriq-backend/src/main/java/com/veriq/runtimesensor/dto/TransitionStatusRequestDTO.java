package com.veriq.runtimesensor.dto;

public class TransitionStatusRequestDTO {
    private String targetStatus;
    private String reason;

    public TransitionStatusRequestDTO() {}

    public String getTargetStatus() {
        return targetStatus;
    }

    public void setTargetStatus(String targetStatus) {
        this.targetStatus = targetStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
