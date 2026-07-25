package com.veriq.common.exception;

import com.veriq.common.dto.ApiResponse;
import com.veriq.common.dto.ErrorDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        ErrorDetail errorDetail = new ErrorDetail("RESOURCE_NOT_FOUND", ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), errorDetail);
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BusinessRuleViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessRuleViolation(BusinessRuleViolationException ex) {
        log.warn("Business rule violation: [{}] {}", ex.getErrorCode(), ex.getMessage());
        ErrorDetail errorDetail = new ErrorDetail(ex.getErrorCode(), ex.getMessage());
        ApiResponse<Void> response = ApiResponse.error(ex.getMessage(), errorDetail);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            fieldErrors.put(fieldName, errorMessage);
        });

        log.warn("Input validation failed: {}", fieldErrors);
        ErrorDetail errorDetail = new ErrorDetail("VALIDATION_FAILED", "Input validation failed", fieldErrors);
        ApiResponse<Void> response = ApiResponse.error("Validation Error", errorDetail);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("Malformed JSON request payload: {}", ex.getMessage());
        ErrorDetail errorDetail = new ErrorDetail("INVALID_JSON_PAYLOAD", "Malformed JSON request payload");
        ApiResponse<Void> response = ApiResponse.error("Invalid request body format", errorDetail);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception ex) {
        log.error("Unhandled server exception encountered: ", ex);
        String details = ex.getMessage() != null ? ex.getMessage() : ex.getClass().getName();
        ErrorDetail errorDetail = new ErrorDetail("INTERNAL_SERVER_ERROR", details);
        ApiResponse<Void> response = ApiResponse.error("An unexpected error occurred: " + details, errorDetail);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
