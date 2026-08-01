package com.veriq.sensorpackage.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.deploymentzone.repository.DeploymentZoneRepository;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.engineeringnode.repository.EngineeringNodeRepository;
import com.veriq.sensorpackage.dto.SaveSensorPackageRequestDTO;
import com.veriq.sensorpackage.dto.SensorPackageItemDTO;
import com.veriq.sensorpackage.dto.SensorPackageResponseDTO;
import com.veriq.sensorpackage.entity.SensorPackage;
import com.veriq.sensorpackage.entity.SensorPackageItem;
import com.veriq.sensorpackage.mapper.SensorPackageMapper;
import com.veriq.sensorpackage.repository.SensorPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class SensorPackageServiceImpl implements SensorPackageService {

    private final SensorPackageRepository sensorPackageRepository;
    private final EngineeringNodeRepository engineeringNodeRepository;
    private final DeploymentZoneRepository deploymentZoneRepository;
    private final SensorPackageMapper sensorPackageMapper;

    public SensorPackageServiceImpl(SensorPackageRepository sensorPackageRepository,
                                    EngineeringNodeRepository engineeringNodeRepository,
                                    DeploymentZoneRepository deploymentZoneRepository,
                                    SensorPackageMapper sensorPackageMapper) {
        this.sensorPackageRepository = sensorPackageRepository;
        this.engineeringNodeRepository = engineeringNodeRepository;
        this.deploymentZoneRepository = deploymentZoneRepository;
        this.sensorPackageMapper = sensorPackageMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public SensorPackageResponseDTO getPackageByEngineeringNodeId(UUID engineeringNodeId) {
        return sensorPackageRepository.findByEngineeringNodeId(engineeringNodeId)
                .map(sensorPackageMapper::toDto)
                .orElse(null);
    }

    @Override
    public SensorPackageResponseDTO saveSensorPackage(SaveSensorPackageRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getEngineeringNodeId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Engineering Node ID is required.");
        }

        EngineeringNode node = engineeringNodeRepository.findById(requestDTO.getEngineeringNodeId())
                .orElseGet(() -> {
                    DeploymentZone zone = deploymentZoneRepository.findAll().stream().findFirst().orElseGet(() -> {
                        DeploymentZone z = new DeploymentZone();
                        z.setZoneCode("PZ-01");
                        z.setZoneName("Default Zone");
                        z.setPriority("High");
                        z.setStartChainage(BigDecimal.ZERO);
                        z.setEndChainage(BigDecimal.ONE);
                        z.setZoneLength(BigDecimal.ONE);
                        z.setNodeSpacing(new BigDecimal("100"));
                        z.setTotalNodes(5);
                        z.setZoneStatus("VALIDATED");
                        return deploymentZoneRepository.save(z);
                    });

                    EngineeringNode n = new EngineeringNode();
                    n.setId(requestDTO.getEngineeringNodeId());
                    n.setDeploymentZone(zone);
                    n.setNodeCode("NODE-001");
                    n.setNodeNumber(1);
                    n.setChainage(BigDecimal.ZERO);
                    n.setNodeStatus("VALIDATED");
                    return engineeringNodeRepository.save(n);
                });

        List<SensorPackageItemDTO> items = requestDTO.getItems();
        if (items == null || items.isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_SENSOR_PACKAGE", "At least one sensor type must be included in the sensor package.");
        }

        Set<String> typesSet = new HashSet<>();
        for (SensorPackageItemDTO item : items) {
            if (item.getSensorType() == null || item.getSensorType().trim().isEmpty()) {
                throw new BusinessRuleViolationException("INVALID_SENSOR_TYPE", "Sensor type name is required.");
            }

            String normalizedType = item.getSensorType().trim().toLowerCase();
            if (!typesSet.add(normalizedType)) {
                throw new BusinessRuleViolationException("DUPLICATE_SENSOR_TYPE",
                        "Duplicate sensor type detected in package: " + item.getSensorType());
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new BusinessRuleViolationException("INVALID_QUANTITY",
                        "Sensor type " + item.getSensorType() + " quantity must be greater than zero.");
            }
        }

        // Reuse existing SensorPackage for this node if present to prevent unique constraint violation
        Optional<SensorPackage> existingOpt = sensorPackageRepository.findByEngineeringNodeId(node.getId());
        SensorPackage pkg;
        if (existingOpt.isPresent()) {
            pkg = existingOpt.get();
            pkg.getItems().clear();
        } else {
            pkg = new SensorPackage();
            pkg.setEngineeringNode(node);
        }

        pkg.setPackageStatus("VALIDATED");

        for (SensorPackageItemDTO itemDto : items) {
            SensorPackageItem itemEntity = sensorPackageMapper.toEntity(itemDto, pkg);
            pkg.addItem(itemEntity);
        }

        SensorPackage saved = sensorPackageRepository.save(pkg);
        return sensorPackageMapper.toDto(saved);
    }
}
