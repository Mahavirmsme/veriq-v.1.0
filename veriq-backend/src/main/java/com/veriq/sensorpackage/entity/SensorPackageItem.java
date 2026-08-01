package com.veriq.sensorpackage.entity;

import com.veriq.common.entity.BaseEntity;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "sensor_package_item")
public class SensorPackageItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sensor_package_id", nullable = false)
    private SensorPackage sensorPackage;

    @Column(name = "sensor_type", nullable = false, length = 100)
    private String sensorType;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 1;

    @Column(name = "sampling_seconds")
    private Integer samplingSeconds = 1;

    @Column(name = "warning_threshold", length = 100)
    private String warningThreshold;

    @Column(name = "critical_threshold", length = 100)
    private String criticalThreshold;

    @Column(name = "measurement_parameter", length = 150)
    private String measurementParameter;

    @Column(name = "engineering_purpose", length = 255)
    private String engineeringPurpose;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public SensorPackageItem() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public SensorPackage getSensorPackage() {
        return sensorPackage;
    }

    public void setSensorPackage(SensorPackage sensorPackage) {
        this.sensorPackage = sensorPackage;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getSamplingSeconds() {
        return samplingSeconds;
    }

    public void setSamplingSeconds(Integer samplingSeconds) {
        this.samplingSeconds = samplingSeconds;
    }

    public String getWarningThreshold() {
        return warningThreshold;
    }

    public void setWarningThreshold(String warningThreshold) {
        this.warningThreshold = warningThreshold;
    }

    public String getCriticalThreshold() {
        return criticalThreshold;
    }

    public void setCriticalThreshold(String criticalThreshold) {
        this.criticalThreshold = criticalThreshold;
    }

    public String getMeasurementParameter() {
        return measurementParameter;
    }

    public void setMeasurementParameter(String measurementParameter) {
        this.measurementParameter = measurementParameter;
    }

    public String getEngineeringPurpose() {
        return engineeringPurpose;
    }

    public void setEngineeringPurpose(String engineeringPurpose) {
        this.engineeringPurpose = engineeringPurpose;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
