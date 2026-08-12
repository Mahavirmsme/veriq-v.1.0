package com.veriq.specification.entity;

import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "sensor_engineering_baseline", uniqueConstraints = {
    @UniqueConstraint(name = "uq_spec_sensor_baseline", columnNames = {"specification_id", "runtime_sensor_id"})
})
public class SensorEngineeringBaseline extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "specification_id", nullable = false)
    private AssetEngineeringSpecification specification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "runtime_sensor_id", nullable = false)
    private RuntimeSensor runtimeSensor;

    @Column(name = "baseline_value", precision = 16, scale = 6)
    private BigDecimal baselineValue;

    @Column(name = "baseline_unit", length = 30)
    private String baselineUnit;

    @Column(name = "parameter_type", length = 100)
    private String parameterType;

    @Column(name = "calibration_reference", length = 150)
    private String calibrationReference;

    @Column(name = "calibration_date")
    private OffsetDateTime calibrationDate;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public SensorEngineeringBaseline() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public AssetEngineeringSpecification getSpecification() {
        return specification;
    }

    public void setSpecification(AssetEngineeringSpecification specification) {
        this.specification = specification;
    }

    public RuntimeSensor getRuntimeSensor() {
        return runtimeSensor;
    }

    public void setRuntimeSensor(RuntimeSensor runtimeSensor) {
        this.runtimeSensor = runtimeSensor;
    }

    public BigDecimal getBaselineValue() {
        return baselineValue;
    }

    public void setBaselineValue(BigDecimal baselineValue) {
        this.baselineValue = baselineValue;
    }

    public String getBaselineUnit() {
        return baselineUnit;
    }

    public void setBaselineUnit(String baselineUnit) {
        this.baselineUnit = baselineUnit;
    }

    public String getParameterType() {
        return parameterType;
    }

    public void setParameterType(String parameterType) {
        this.parameterType = parameterType;
    }

    public String getCalibrationReference() {
        return calibrationReference;
    }

    public void setCalibrationReference(String calibrationReference) {
        this.calibrationReference = calibrationReference;
    }

    public OffsetDateTime getCalibrationDate() {
        return calibrationDate;
    }

    public void setCalibrationDate(OffsetDateTime calibrationDate) {
        this.calibrationDate = calibrationDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
