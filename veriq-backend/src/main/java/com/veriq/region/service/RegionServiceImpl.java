package com.veriq.region.service;

import com.veriq.asset.entity.Asset;
import com.veriq.asset.repository.AssetRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.region.dto.RegionItemDTO;
import com.veriq.region.dto.RegionResponseDTO;
import com.veriq.region.dto.SaveRegionsRequestDTO;
import com.veriq.region.entity.Region;
import com.veriq.region.mapper.RegionMapper;
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
public class RegionServiceImpl implements RegionService {

    private final RegionRepository regionRepository;
    private final AssetRepository assetRepository;
    private final RegionMapper regionMapper;

    public RegionServiceImpl(RegionRepository regionRepository,
                             AssetRepository assetRepository,
                             RegionMapper regionMapper) {
        this.regionRepository = regionRepository;
        this.assetRepository = assetRepository;
        this.regionMapper = regionMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegionResponseDTO> getRegionsByAssetId(UUID assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset", "id", assetId);
        }
        return regionRepository.findByAssetIdOrderByStartChainageAsc(assetId).stream()
                .map(regionMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionResponseDTO> saveRegions(SaveRegionsRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getAssetId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Asset ID is required.");
        }

        Asset asset = assetRepository.findById(requestDTO.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", requestDTO.getAssetId()));

        if (!"Linear".equalsIgnoreCase(asset.getAssetNature())) {
            throw new BusinessRuleViolationException("NOT_APPLICABLE",
                    "Region Engineering Workspace is available ONLY for Linear Assets.");
        }

        List<RegionItemDTO> items = requestDTO.getRegions();
        if (items == null || items.isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_REGIONS", "At least one region must be specified.");
        }

        // Sort by startChainage ascending
        items.sort(Comparator.comparing(RegionItemDTO::getStartChainage));

        // Validation Engine Rule Checks
        BigDecimal assetStart = asset.getStartChainage() != null ? asset.getStartChainage() : BigDecimal.ZERO;
        BigDecimal assetEnd = asset.getEndChainage() != null ? asset.getEndChainage() : BigDecimal.ZERO;
        BigDecimal assetLength = asset.getTotalLength() != null ? asset.getTotalLength() : assetEnd.subtract(assetStart);

        // Check 1: First Region starts at Asset Start
        if (items.get(0).getStartChainage().compareTo(assetStart) != 0) {
            throw new BusinessRuleViolationException("START_MISMATCH",
                    "First Region start chainage (" + items.get(0).getStartChainage() + ") must equal Asset start chainage (" + assetStart + ").");
        }

        // Check 2: Last Region ends at Asset End
        if (items.get(items.size() - 1).getEndChainage().compareTo(assetEnd) != 0) {
            throw new BusinessRuleViolationException("END_MISMATCH",
                    "Last Region end chainage (" + items.get(items.size() - 1).getEndChainage() + ") must equal Asset end chainage (" + assetEnd + ").");
        }

        BigDecimal totalCoverage = BigDecimal.ZERO;
        for (int i = 0; i < items.size(); i++) {
            RegionItemDTO current = items.get(i);

            // Check 3: Region Length > 0
            if (current.getEndChainage().compareTo(current.getStartChainage()) <= 0) {
                throw new BusinessRuleViolationException("INVALID_REGION_LENGTH",
                        "Region " + current.getRegionCode() + " end chainage must be greater than start chainage.");
            }

            BigDecimal currentLength = current.getEndChainage().subtract(current.getStartChainage());
            totalCoverage = totalCoverage.add(currentLength);

            // Check 4: No gaps or overlaps between adjacent regions
            if (i > 0) {
                RegionItemDTO previous = items.get(i - 1);
                if (current.getStartChainage().compareTo(previous.getEndChainage()) != 0) {
                    throw new BusinessRuleViolationException("GAP_OR_OVERLAP",
                            "Gap or overlap detected between " + previous.getRegionCode() + " (end: " + previous.getEndChainage() + ") and " + current.getRegionCode() + " (start: " + current.getStartChainage() + ").");
                }
            }
        }

        // Check 5: Total Region Coverage equals Asset Length
        if (totalCoverage.compareTo(assetLength) != 0) {
            throw new BusinessRuleViolationException("COVERAGE_MISMATCH",
                    "Total Region coverage (" + totalCoverage + " km) does not equal Asset length (" + assetLength + " km).");
        }

        // Delete existing regions for asset and persist new validated regions
        regionRepository.deleteByAssetId(asset.getId());

        List<Region> entityList = items.stream()
                .map(item -> regionMapper.toEntity(item, asset))
                .collect(Collectors.toList());

        List<Region> savedEntities = regionRepository.saveAll(entityList);
        return savedEntities.stream()
                .map(regionMapper::toDto)
                .collect(Collectors.toList());
    }
}
