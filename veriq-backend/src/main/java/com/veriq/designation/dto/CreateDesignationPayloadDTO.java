package com.veriq.designation.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateDesignationPayloadDTO {

    @NotBlank(message = "Designation title is required")
    private String title;

    @NotBlank(message = "Designation code is required")
    private String code;

    private String status = "ACTIVE";

    public CreateDesignationPayloadDTO() {}

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
