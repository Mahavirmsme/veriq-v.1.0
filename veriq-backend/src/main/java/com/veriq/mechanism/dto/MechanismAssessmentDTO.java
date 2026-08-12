package com.veriq.mechanism.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.veriq.mechanism.model.AssessmentStatus;
import com.veriq.mechanism.model.MechanismType;

import java.time.OffsetDateTime;

public class MechanismAssessmentDTO {

    private MechanismType mechanismType;
    private AssessmentStatus status;
    private String evaluationMessage;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private OffsetDateTime evaluationTimestamp;

    public MechanismAssessmentDTO() {}

    public MechanismAssessmentDTO(MechanismType mechanismType, AssessmentStatus status, String evaluationMessage) {
        this.mechanismType = mechanismType;
        this.status = status;
        this.evaluationMessage = evaluationMessage;
        this.evaluationTimestamp = OffsetDateTime.now();
    }

    public static MechanismAssessmentDTO unEvaluated(MechanismType type) {
        return new MechanismAssessmentDTO(
                type,
                AssessmentStatus.UNEVALUATED,
                "Requires engineering parameters and threshold specification"
        );
    }

    public MechanismType getMechanismType() {
        return mechanismType;
    }

    public void setMechanismType(MechanismType mechanismType) {
        this.mechanismType = mechanismType;
    }

    public AssessmentStatus getStatus() {
        return status;
    }

    public void setStatus(AssessmentStatus status) {
        this.status = status;
    }

    public String getEvaluationMessage() {
        return evaluationMessage;
    }

    public void setEvaluationMessage(String evaluationMessage) {
        this.evaluationMessage = evaluationMessage;
    }

    public OffsetDateTime getEvaluationTimestamp() {
        return evaluationTimestamp;
    }

    public void setEvaluationTimestamp(OffsetDateTime evaluationTimestamp) {
        this.evaluationTimestamp = evaluationTimestamp;
    }
}
