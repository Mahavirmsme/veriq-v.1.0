package com.veriq.common.dto;

import java.util.Map;

public class ErrorDetail {

    private String code;
    private String details;
    private Map<String, String> fieldErrors;

    public ErrorDetail() {}

    public ErrorDetail(String code, String details) {
        this.code = code;
        this.details = details;
    }

    public ErrorDetail(String code, String details, Map<String, String> fieldErrors) {
        this.code = code;
        this.details = details;
        this.fieldErrors = fieldErrors;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }
}
