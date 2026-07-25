package com.veriq.sensorpackage.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.engineeringnode.entity.EngineeringNode;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sensor_package")
public class SensorPackage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "engineering_node_id", nullable = false, unique = true)
    private EngineeringNode engineeringNode;

    @Column(name = "package_status", nullable = false, length = 20)
    private String packageStatus = "VALIDATED";

    @OneToMany(mappedBy = "sensorPackage", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SensorPackageItem> items = new ArrayList<>();

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public SensorPackage() {}

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

    public String getPackageStatus() {
        return packageStatus;
    }

    public void setPackageStatus(String packageStatus) {
        this.packageStatus = packageStatus;
    }

    public List<SensorPackageItem> getItems() {
        return items;
    }

    public void setItems(List<SensorPackageItem> items) {
        this.items = items;
    }

    public void addItem(SensorPackageItem item) {
        items.add(item);
        item.setSensorPackage(this);
    }
}
