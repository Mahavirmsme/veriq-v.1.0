package com.veriq.commissioning.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.engineeringnode.entity.EngineeringNode;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "runtime_sensor")
public class RuntimeSensor extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "commissioning_record_id", nullable = false)
    private CommissioningRecord commissioningRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "engineering_node_id", nullable = false)
    private EngineeringNode engineeringNode;

    @Column(name = "sensor_code", nullable = false, unique = true, length = 50)
    private String sensorCode;

    @Column(name = "sensor_type", nullable = false, length = 100)
    private String sensorType;

    @Column(name = "measurement_parameter", length = 150)
    private String measurementParameter;

    @Column(name = "sensor_status", nullable = false, length = 20)
    private String sensorStatus = "ACTIVE";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public RuntimeSensor() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public CommissioningRecord getCommissioningRecord() {
        return commissioningRecord;
    }

    public void setCommissioningRecord(CommissioningRecord commissioningRecord) {
        this.commissioningRecord = commissioningRecord;
    }

    public EngineeringNode getEngineeringNode() {
        return engineeringNode;
    }

    public void setEngineeringNode(EngineeringNode engineeringNode) {
        this.engineeringNode = engineeringNode;
    }

    public String getSensorCode() {
        return sensorCode;
    }

    public void setSensorCode(String sensorCode) {
        this.sensorCode = sensorCode;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public String getMeasurementParameter() {
        return measurementParameter;
    }

    public void setMeasurementParameter(String measurementParameter) {
        this.measurementParameter = measurementParameter;
    }

    public String getSensorStatus() {
        return sensorStatus;
    }

    public void setSensorStatus(String sensorStatus) {
        this.sensorStatus = sensorStatus;
    }
}
