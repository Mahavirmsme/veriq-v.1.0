package com.veriq.commissioning.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.sensorpackage.entity.SensorPackage;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "commissioning_record")
public class CommissioningRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "engineering_node_id", nullable = false, unique = true)
    private EngineeringNode engineeringNode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sensor_package_id", nullable = false)
    private SensorPackage sensorPackage;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, PARTIALLY_COMMISSIONED, COMMISSIONED

    @Column(name = "commissioned_date")
    private OffsetDateTime commissionedDate;

    @Column(name = "remarks", length = 255)
    private String remarks;

    @OneToMany(mappedBy = "commissioningRecord", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RuntimeSensor> runtimeSensors = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public CommissioningRecord() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public EngineeringNode getEngineeringNode() {
        return engineeringNode;
    }

    public void setEngineeringNode(EngineeringNode engineeringNode) {
        this.engineeringNode = engineeringNode;
    }

    public SensorPackage getSensorPackage() {
        return sensorPackage;
    }

    public void setSensorPackage(SensorPackage sensorPackage) {
        this.sensorPackage = sensorPackage;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCommissionedDate() {
        return commissionedDate;
    }

    public void setCommissionedDate(OffsetDateTime commissionedDate) {
        this.commissionedDate = commissionedDate;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public List<RuntimeSensor> getRuntimeSensors() {
        return runtimeSensors;
    }

    public void setRuntimeSensors(List<RuntimeSensor> runtimeSensors) {
        this.runtimeSensors = runtimeSensors;
    }

    public void addRuntimeSensor(RuntimeSensor sensor) {
        runtimeSensors.add(sensor);
        sensor.setCommissioningRecord(this);
    }
}
