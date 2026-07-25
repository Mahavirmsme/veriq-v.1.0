package com.veriq.organization.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateOrganizationRequestDTO {

    // Section 1: Organization Information
    @NotBlank(message = "Organization name is required")
    @Size(max = 100, message = "Organization name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Organization type is required")
    @Size(max = 50, message = "Organization type must not exceed 50 characters")
    private String organizationType;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status must not exceed 20 characters")
    private String status;

    private String description;

    // Section 2: Primary Contact
    @NotBlank(message = "Contact person is required")
    @Size(max = 100, message = "Contact person must not exceed 100 characters")
    private String contactPerson;

    @Size(max = 100, message = "Designation must not exceed 100 characters")
    private String designation;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Contact email must be valid")
    @Size(max = 150, message = "Email must not exceed 150 characters")
    private String contactEmail;

    @NotBlank(message = "Contact mobile is required")
    @Size(max = 30, message = "Mobile must not exceed 30 characters")
    private String contactMobile;

    // Section 3: Address
    @Size(max = 255, message = "Address Line 1 must not exceed 255 characters")
    private String addressLine1;

    @Size(max = 255, message = "Address Line 2 must not exceed 255 characters")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    @Size(max = 20, message = "PIN Code must not exceed 20 characters")
    private String pinCode;

    public UpdateOrganizationRequestDTO() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(String organizationType) {
        this.organizationType = organizationType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactMobile() {
        return contactMobile;
    }

    public void setContactMobile(String contactMobile) {
        this.contactMobile = contactMobile;
    }

    public String getAddressLine1() {
        return addressLine1;
    }

    public void setAddressLine1(String addressLine1) {
        this.addressLine1 = addressLine1;
    }

    public String getAddressLine2() {
        return addressLine2;
    }

    public void setAddressLine2(String addressLine2) {
        this.addressLine2 = addressLine2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }
}
