package com.veriq.engineeringnode.entity;

import com.veriq.common.entity.BaseEntity;
import com.veriq.deploymentzone.entity.DeploymentZone;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "engineering_node")
public class EngineeringNode extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "deployment_zone_id", nullable = false)
    private DeploymentZone deploymentZone;

    @Column(name = "node_code", nullable = false, length = 50)
    private String nodeCode;

    @Column(name = "node_number", nullable = false)
    private Integer nodeNumber;

    @Column(name = "chainage", nullable = false, precision = 12, scale = 3)
    private BigDecimal chainage;

    @Column(name = "node_status", nullable = false, length = 20)
    private String nodeStatus = "VALIDATED";

    @PrePersist
    public void ensureId() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
    }

    public EngineeringNode() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DeploymentZone getDeploymentZone() {
        return deploymentZone;
    }

    public void setDeploymentZone(DeploymentZone deploymentZone) {
        this.deploymentZone = deploymentZone;
    }

    public String getNodeCode() {
        return nodeCode;
    }

    public void setNodeCode(String nodeCode) {
        this.nodeCode = nodeCode;
    }

    public Integer getNodeNumber() {
        return nodeNumber;
    }

    public void setNodeNumber(Integer nodeNumber) {
        this.nodeNumber = nodeNumber;
    }

    public BigDecimal getChainage() {
        return chainage;
    }

    public void setChainage(BigDecimal chainage) {
        this.chainage = chainage;
    }

    public String getNodeStatus() {
        return nodeStatus;
    }

    public void setNodeStatus(String nodeStatus) {
        this.nodeStatus = nodeStatus;
    }
}
