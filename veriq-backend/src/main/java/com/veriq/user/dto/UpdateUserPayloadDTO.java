package com.veriq.user.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateUserPayloadDTO {

    @NotBlank(message = "First name is required")
    private String firstName;

    private String lastName;

    private String status;

    public UpdateUserPayloadDTO() {}

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
