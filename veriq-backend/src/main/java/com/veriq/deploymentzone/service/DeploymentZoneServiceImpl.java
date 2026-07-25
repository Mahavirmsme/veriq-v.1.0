package com.veriq.deploymentzone.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.deploymentzone.dto.DeploymentZoneItemDTO;
import com.veriq.deploymentzone.dto.DeploymentZoneResponseDTO;
import com.veriq.deploymentzone.dto.SaveDeploymentZonesRequestDTO;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.deploymentzone.mapper.DeploymentZoneMapper;
import com.veriq.deploymentzone.repository.DeploymentZoneRepository;
import com.veriq.region.entity.Region;
import com.veriq.region.repository.RegionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeploymentZoneServiceImpl implements DeploymentZoneService {

    private final DeploymentZoneRepository deploymentZoneRepository;
    private final RegionRepository regionRepository;
    private final DeploymentZoneMapper deploymentZoneMapper;

    public DeploymentZoneServiceImpl(DeploymentZoneRepository deploymentZoneRepository,
                                     RegionRepository regionRepository,
                                     DeploymentZoneMapper deploymentZoneMapper) {
        this.deploymentZoneRepository = deploymentZoneRepository;
        this.regionRepository = regionRepository;
        this.deploymentZoneMapper = deploymentZoneMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeploymentZoneResponseDTO> getZonesByRegionId(UUID regionId) {
        if (!regionRepository.existsById(regionId)) {
            throw new ResourceNotFoundException("Region", "id", regionId);
        }
        return deploymentZoneRepository.findByRegionIdOrderByStartChainageAsc(regionId).stream()
                .map(deploymentZoneMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeploymentZoneResponseDTO> saveDeploymentZones(SaveDeploymentZonesRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getRegionId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Region ID is required.");
        }

        Region region = regionRepository.findById(requestDTO.getRegionId())
                .orElseThrow(() -> new ResourceNotFoundException("Region", "id", requestDTO.getRegionId()));

        List<DeploymentZoneItemDTO> items = requestDTO.getZones();
        if (items == null || items.isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_ZONES", "At least one deployment zone must be specified.");
        }

        // Sort by startChainage ascending
        items.sort(Comparator.comparing(DeploymentZoneItemDTO::getStartChainage));

        BigDecimal regionStart = region.getStartChainage();
        BigDecimal regionEnd = region.getEndChainage();
        BigDecimal regionLength = region.getRegionLength() != null ? region.getRegionLength() : regionEnd.subtract(regionStart);

        // Check 1: First Zone starts at Region Start
        if (items.get(0).getStartChainage().compareTo(regionStart) != 0) {
            throw new BusinessRuleViolationException("START_MISMATCH",
                    "First Deployment Zone start chainage (" + items.get(0).getStartChainage() + ") must equal Region start chainage (" + regionStart + ").");
        }

        // Check 2: Last Zone ends at Region End
        if (items.get(items.size() - 1).getEndChainage().compareTo(regionEnd) != 0) {
            throw new BusinessRuleViolationException("END_MISMATCH",
                    "Last Deployment Zone end chainage (" + items.get(items.size() - 1).getEndChainage() + ") must equal Region end chainage (" + regionEnd + ").");
        }

        BigDecimal totalCoverage = BigDecimal.ZERO;
        for (int i = 0; i < items.size(); i++) {
            DeploymentZoneItemDTO current = items.get(i);

            // Check 3: Zone Length > 0
            if (current.getEndChainage().compareTo(current.getStartChainage()) <= 0) {
                throw new BusinessRuleViolationException("INVALID_ZONE_LENGTH",
                        "Deployment Zone " + current.getZoneCode() + " end chainage must be greater than start chainage.");
            }

            // Check 4: Node Spacing > 0
            if (current.getNodeSpacing() == null || current.getNodeSpacing().compareTo(BigDecimal.ZERO) <= 0) {
                throw new BusinessRuleViolationException("INVALID_NODE_SPACING",
                        "Deployment Zone " + current.getZoneCode() + " node spacing must be greater than zero.");
            }

            BigDecimal currentLength = current.getEndChainage().subtract(current.getStartChainage());
            totalCoverage = totalCoverage.add(currentLength);

            // Check 5: No gaps or overlaps between adjacent zones
            if (i > 0) {
                DeploymentZoneItemDTO previous = items.get(i - 1);
                if (current.getStartChainage().compareTo(previous.getEndChainage()) != 0) {
                    throw new BusinessRuleViolationException("GAP_OR_OVERLAP",
                            "Gap or overlap detected between " + previous.getZoneCode() + " (end: " + previous.getEndChainage() + ") and " + current.getZoneCode() + " (start: " + current.getStartChainage() + ").");
                }
            }
        }

        // Check 6: Total Zone Coverage equals Region Length
        if (totalCoverage.compareTo(regionLength) != 0) {
            throw new BusinessRuleViolationException("COVERAGE_MISMATCH",
                    "Total Deployment Zone coverage (" + totalCoverage + " km) does not equal Region length (" + regionLength + " km).");
        }

        // Delete existing deployment zones for region and persist new validated zones
        deploymentZoneRepository.deleteByRegionId(region.getId());

        List<DeploymentZone> entityList = items.stream()
                .map(item -> deploymentZoneMapper.toEntity(item, region))
                .collect(Collectors.toList());

        List<DeploymentZone> savedEntities = deploymentZoneRepository.saveAll(entityList);
        return savedEntities.stream()
                .map(deploymentZoneMapper::toDto)
                .collect(Collectors.toList());
    }
}
