package com.veriq.deploymentzonestate.service;

import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.deploymentzone.repository.DeploymentZoneRepository;
import com.veriq.deploymentzonestate.dto.DeploymentZoneStateDTO;
import com.veriq.deploymentzonestate.entity.DeploymentZoneStateRecord;
import com.veriq.deploymentzonestate.mapper.DeploymentZoneStateMapper;
import com.veriq.deploymentzonestate.repository.DeploymentZoneStateRecordRepository;
import com.veriq.regionhealth.service.RegionHealthEngineService;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeploymentZoneStateRepositoryServiceImpl implements DeploymentZoneStateRepositoryService {

    private final DeploymentZoneStateRecordRepository zoneStateRecordRepository;
    private final DeploymentZoneRepository deploymentZoneRepository;
    private final DeploymentZoneStateMapper deploymentZoneStateMapper;
    private final RegionHealthEngineService regionHealthEngineService;

    public DeploymentZoneStateRepositoryServiceImpl(DeploymentZoneStateRecordRepository zoneStateRecordRepository,
                                                     DeploymentZoneRepository deploymentZoneRepository,
                                                     DeploymentZoneStateMapper deploymentZoneStateMapper,
                                                     @Lazy RegionHealthEngineService regionHealthEngineService) {
        this.zoneStateRecordRepository = zoneStateRecordRepository;
        this.deploymentZoneRepository = deploymentZoneRepository;
        this.deploymentZoneStateMapper = deploymentZoneStateMapper;
        this.regionHealthEngineService = regionHealthEngineService;
    }

    @Override
    public DeploymentZoneStateDTO storeZoneHealthState(UUID deploymentZoneId, String currentHealth, int totalNodes, int healthyNodes, int warningNodes, int criticalNodes, int offlineNodes, OffsetDateTime evaluationTimestamp) {
        if (deploymentZoneId == null) {
            return null;
        }

        DeploymentZone zone = deploymentZoneRepository.findById(deploymentZoneId)
                .orElseThrow(() -> new ResourceNotFoundException("DeploymentZone", "id", deploymentZoneId));

        Optional<DeploymentZoneStateRecord> existingOpt = zoneStateRecordRepository.findByDeploymentZoneId(deploymentZoneId);
        DeploymentZoneStateRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            record.setPreviousHealth(record.getCurrentHealth());
            record.setCurrentHealth(currentHealth);
            record.setTotalNodes(totalNodes);
            record.setHealthyNodes(healthyNodes);
            record.setWarningNodes(warningNodes);
            record.setCriticalNodes(criticalNodes);
            record.setOfflineNodes(offlineNodes);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        } else {
            record = new DeploymentZoneStateRecord();
            record.setDeploymentZone(zone);
            record.setPreviousHealth("NONE");
            record.setCurrentHealth(currentHealth);
            record.setTotalNodes(totalNodes);
            record.setHealthyNodes(healthyNodes);
            record.setWarningNodes(warningNodes);
            record.setCriticalNodes(criticalNodes);
            record.setOfflineNodes(offlineNodes);
            record.setEvaluationTimestamp(evaluationTimestamp != null ? evaluationTimestamp : OffsetDateTime.now());
            record.setEvaluationVersion("v1.0.0");
        }

        DeploymentZoneStateRecord saved = zoneStateRecordRepository.save(record);

        // Trigger Region Health Engine aggregation for parent region
        if (regionHealthEngineService != null && zone.getRegion() != null) {
            regionHealthEngineService.evaluateRegionHealth(zone.getRegion().getId());
        }

        return deploymentZoneStateMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DeploymentZoneStateDTO getLatestZoneState(UUID deploymentZoneId) {
        return zoneStateRecordRepository.findByDeploymentZoneId(deploymentZoneId)
                .map(deploymentZoneStateMapper::toDto)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentZoneStateDTO> getAllZoneStates() {
        return zoneStateRecordRepository.findAll().stream()
                .map(deploymentZoneStateMapper::toDto)
                .collect(Collectors.toList());
    }
}
