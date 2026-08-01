package com.veriq.deploymentzone.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.deploymentzone.dto.DeploymentZoneItemDTO;
import com.veriq.deploymentzone.dto.DeploymentZoneResponseDTO;
import com.veriq.deploymentzone.dto.SaveDeploymentZonesRequestDTO;
import com.veriq.deploymentzone.entity.DeploymentZone;
import com.veriq.deploymentzone.mapper.DeploymentZoneMapper;
import com.veriq.deploymentzone.repository.DeploymentZoneRepository;
import com.veriq.pointasset.entity.PointAsset;
import com.veriq.pointasset.repository.PointAssetRepository;
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
    private final PointAssetRepository pointAssetRepository;
    private final DeploymentZoneMapper deploymentZoneMapper;

    public DeploymentZoneServiceImpl(DeploymentZoneRepository deploymentZoneRepository,
                                     RegionRepository regionRepository,
                                     PointAssetRepository pointAssetRepository,
                                     DeploymentZoneMapper deploymentZoneMapper) {
        this.deploymentZoneRepository = deploymentZoneRepository;
        this.regionRepository = regionRepository;
        this.pointAssetRepository = pointAssetRepository;
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
    @Transactional(readOnly = true)
    public List<DeploymentZoneResponseDTO> getZonesByAssetId(UUID assetId) {
        List<DeploymentZone> byPointAsset = deploymentZoneRepository.findByPointAssetId(assetId);
        if (!byPointAsset.isEmpty()) {
            return byPointAsset.stream().map(deploymentZoneMapper::toDto).collect(Collectors.toList());
        }
        List<DeploymentZone> direct = deploymentZoneRepository.findByAssetId(assetId);
        if (!direct.isEmpty()) {
            return direct.stream().map(deploymentZoneMapper::toDto).collect(Collectors.toList());
        }
        return deploymentZoneRepository.findByRegionAssetId(assetId).stream()
                .map(deploymentZoneMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<DeploymentZoneResponseDTO> saveDeploymentZones(SaveDeploymentZonesRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getRegionId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Target ID is required.");
        }

        List<DeploymentZoneItemDTO> items = requestDTO.getZones();
        if (items == null || items.isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_ZONES", "At least one deployment zone must be specified.");
        }

        // Sort by startChainage ascending
        items.sort(Comparator.comparing(DeploymentZoneItemDTO::getStartChainage));

        Region region = regionRepository.findById(requestDTO.getRegionId()).orElse(null);

        if (region != null) {
            // Linear Asset Validation via Region
            BigDecimal regionStart = region.getStartChainage();
            BigDecimal regionEnd = region.getEndChainage();
            BigDecimal regionLength = region.getRegionLength() != null ? region.getRegionLength() : regionEnd.subtract(regionStart);

            if (items.get(0).getStartChainage().compareTo(regionStart) != 0) {
                throw new BusinessRuleViolationException("START_MISMATCH",
                        "First Deployment Zone start chainage (" + items.get(0).getStartChainage() + ") must equal Region start chainage (" + regionStart + ").");
            }

            if (items.get(items.size() - 1).getEndChainage().compareTo(regionEnd) != 0) {
                throw new BusinessRuleViolationException("END_MISMATCH",
                        "Last Deployment Zone end chainage (" + items.get(items.size() - 1).getEndChainage() + ") must equal Region end chainage (" + regionEnd + ").");
            }

            BigDecimal totalCoverage = BigDecimal.ZERO;
            for (int i = 0; i < items.size(); i++) {
                DeploymentZoneItemDTO current = items.get(i);
                if (current.getEndChainage().compareTo(current.getStartChainage()) <= 0) {
                    throw new BusinessRuleViolationException("INVALID_ZONE_LENGTH",
                            "Deployment Zone " + current.getZoneCode() + " end chainage must be greater than start chainage.");
                }
                if (current.getNodeSpacing() == null || current.getNodeSpacing().compareTo(BigDecimal.ZERO) <= 0) {
                    throw new BusinessRuleViolationException("INVALID_NODE_SPACING",
                            "Deployment Zone " + current.getZoneCode() + " node spacing must be greater than zero.");
                }
                BigDecimal currentLength = current.getEndChainage().subtract(current.getStartChainage());
                totalCoverage = totalCoverage.add(currentLength);

                if (i > 0) {
                    DeploymentZoneItemDTO previous = items.get(i - 1);
                    if (current.getStartChainage().compareTo(previous.getEndChainage()) != 0) {
                        throw new BusinessRuleViolationException("GAP_OR_OVERLAP",
                                "Gap or overlap detected between " + previous.getZoneCode() + " (end: " + previous.getEndChainage() + ") and " + current.getZoneCode() + " (start: " + current.getStartChainage() + ").");
                    }
                }
            }

            if (totalCoverage.compareTo(regionLength) != 0) {
                throw new BusinessRuleViolationException("COVERAGE_MISMATCH",
                        "Total Deployment Zone coverage (" + totalCoverage + " km) does not equal Region length (" + regionLength + " km).");
            }

            deploymentZoneRepository.deleteByRegionId(region.getId());

            List<DeploymentZone> entityList = items.stream()
                    .map(item -> deploymentZoneMapper.toEntity(item, region))
                    .collect(Collectors.toList());

            List<DeploymentZone> savedEntities = deploymentZoneRepository.saveAll(entityList);
            return savedEntities.stream()
                    .map(deploymentZoneMapper::toDto)
                    .collect(Collectors.toList());
        } else {
            // Direct Point Asset Save
            UUID pointAssetId = requestDTO.getRegionId();
            PointAsset pointAsset = pointAssetRepository.findById(pointAssetId).orElse(null);

            deploymentZoneRepository.deleteByPointAssetId(pointAssetId);
            deploymentZoneRepository.deleteByAssetId(pointAssetId);

            List<DeploymentZone> entityList = items.stream()
                    .map(item -> {
                        DeploymentZone z = new DeploymentZone();
                        if (pointAsset != null) {
                            z.setPointAsset(pointAsset);
                            z.setAsset(pointAsset.getAsset());
                        }
                        z.setZoneCode(item.getZoneCode());
                        z.setZoneName(item.getZoneName());
                        z.setPriority(item.getPriority());
                        z.setStartChainage(item.getStartChainage());
                        z.setEndChainage(item.getEndChainage());
                        z.setZoneLength(item.getEndChainage().subtract(item.getStartChainage()));
                        z.setNodeSpacing(item.getNodeSpacing());
                        z.setTotalNodes(item.getNodeSpacing() != null && item.getNodeSpacing().compareTo(BigDecimal.ZERO) > 0
                                ? Math.max(1, (int) Math.floor(z.getZoneLength().doubleValue() * 1000 / item.getNodeSpacing().doubleValue()) + 1)
                                : 1);
                        z.setZoneStatus("VALIDATED");
                        return z;
                    })
                    .collect(Collectors.toList());

            List<DeploymentZone> savedEntities = deploymentZoneRepository.saveAll(entityList);
            return savedEntities.stream()
                    .map(deploymentZoneMapper::toDto)
                    .collect(Collectors.toList());
        }
    }
}
