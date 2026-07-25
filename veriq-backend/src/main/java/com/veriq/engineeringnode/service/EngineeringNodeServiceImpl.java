package com.veriq.engineeringnode.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.deploymentzone.repository.DeploymentZoneRepository;
import com.veriq.engineeringnode.dto.EngineeringNodeItemDTO;
import com.veriq.engineeringnode.dto.EngineeringNodeResponseDTO;
import com.veriq.engineeringnode.dto.SaveEngineeringNodesRequestDTO;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.engineeringnode.mapper.EngineeringNodeMapper;
import com.veriq.engineeringnode.repository.EngineeringNodeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class EngineeringNodeServiceImpl implements EngineeringNodeService {

    private final EngineeringNodeRepository engineeringNodeRepository;
    private final DeploymentZoneRepository deploymentZoneRepository;
    private final EngineeringNodeMapper engineeringNodeMapper;

    public EngineeringNodeServiceImpl(EngineeringNodeRepository engineeringNodeRepository,
                                      DeploymentZoneRepository deploymentZoneRepository,
                                      EngineeringNodeMapper engineeringNodeMapper) {
        this.engineeringNodeRepository = engineeringNodeRepository;
        this.deploymentZoneRepository = deploymentZoneRepository;
        this.engineeringNodeMapper = engineeringNodeMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EngineeringNodeResponseDTO> getNodesByDeploymentZoneId(UUID deploymentZoneId) {
        if (!deploymentZoneRepository.existsById(deploymentZoneId)) {
            throw new ResourceNotFoundException("DeploymentZone", "id", deploymentZoneId);
        }
        return engineeringNodeRepository.findByDeploymentZoneIdOrderByNodeNumberAsc(deploymentZoneId).stream()
                .map(engineeringNodeMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EngineeringNodeResponseDTO> saveEngineeringNodes(SaveEngineeringNodesRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getDeploymentZoneId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Deployment Zone ID is required.");
        }

        DeploymentZone zone = deploymentZoneRepository.findById(requestDTO.getDeploymentZoneId())
                .orElseThrow(() -> new ResourceNotFoundException("DeploymentZone", "id", requestDTO.getDeploymentZoneId()));

        List<EngineeringNodeItemDTO> items = requestDTO.getNodes();
        if (items == null || items.isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_NODES", "At least one engineering node must be generated.");
        }

        // Sort by nodeNumber ascending
        items.sort(Comparator.comparing(EngineeringNodeItemDTO::getNodeNumber));

        BigDecimal zoneStart = zone.getStartChainage();
        BigDecimal zoneEnd = zone.getEndChainage();

        // Check 1: First Engineering Node starts at Deployment Zone Start Chainage
        if (items.get(0).getChainage().compareTo(zoneStart) != 0) {
            throw new BusinessRuleViolationException("START_MISMATCH",
                    "First Engineering Node chainage (" + items.get(0).getChainage() + ") must equal Deployment Zone start chainage (" + zoneStart + ").");
        }

        // Check 2: Last Engineering Node ends at Deployment Zone End Chainage
        if (items.get(items.size() - 1).getChainage().compareTo(zoneEnd) != 0) {
            throw new BusinessRuleViolationException("END_MISMATCH",
                    "Last Engineering Node chainage (" + items.get(items.size() - 1).getChainage() + ") must equal Deployment Zone end chainage (" + zoneEnd + ").");
        }

        Set<Integer> numbersSet = new HashSet<>();
        Set<BigDecimal> chainagesSet = new HashSet<>();

        for (int i = 0; i < items.size(); i++) {
            EngineeringNodeItemDTO current = items.get(i);

            // Check 3: Continuous sequence
            if (current.getNodeNumber() != i + 1) {
                throw new BusinessRuleViolationException("NON_CONTINUOUS_SEQUENCE",
                        "Engineering Node sequence broken. Expected node number " + (i + 1) + " but found " + current.getNodeNumber() + ".");
            }

            // Check 4: No duplicate node numbers
            if (!numbersSet.add(current.getNodeNumber())) {
                throw new BusinessRuleViolationException("DUPLICATE_NODE_NUMBER",
                        "Duplicate Engineering Node number detected: " + current.getNodeNumber());
            }

            // Check 5: No duplicate chainages
            if (!chainagesSet.add(current.getChainage())) {
                throw new BusinessRuleViolationException("DUPLICATE_CHAINAGE",
                        "Duplicate Engineering Node chainage detected: " + current.getChainage());
            }
        }

        // Delete existing engineering nodes for zone and persist new validated nodes
        engineeringNodeRepository.deleteByDeploymentZoneId(zone.getId());

        List<EngineeringNode> entityList = items.stream()
                .map(item -> engineeringNodeMapper.toEntity(item, zone))
                .collect(Collectors.toList());

        List<EngineeringNode> savedEntities = engineeringNodeRepository.saveAll(entityList);
        return savedEntities.stream()
                .map(engineeringNodeMapper::toDto)
                .collect(Collectors.toList());
    }
}
