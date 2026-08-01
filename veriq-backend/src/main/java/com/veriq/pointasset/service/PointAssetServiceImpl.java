package com.veriq.pointasset.service;

import com.veriq.asset.entity.Asset;
import com.veriq.asset.repository.AssetRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.pointasset.dto.CreatePointAssetRequestDTO;
import com.veriq.pointasset.dto.PointAssetResponseDTO;
import com.veriq.pointasset.entity.PointAsset;
import com.veriq.pointasset.repository.PointAssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointAssetServiceImpl implements PointAssetService {

    private final PointAssetRepository pointAssetRepository;
    private final AssetRepository assetRepository;

    public PointAssetServiceImpl(PointAssetRepository pointAssetRepository,
                                 AssetRepository assetRepository) {
        this.pointAssetRepository = pointAssetRepository;
        this.assetRepository = assetRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PointAssetResponseDTO> getPointAssetsByAssetId(UUID assetId) {
        if (!assetRepository.existsById(assetId)) {
            throw new ResourceNotFoundException("Asset", "id", assetId);
        }
        return pointAssetRepository.findByAssetIdOrderByPointAssetCodeAsc(assetId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PointAssetResponseDTO> getAllPointAssets() {
        return pointAssetRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PointAssetResponseDTO createPointAsset(CreatePointAssetRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getAssetId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Asset ID is required.");
        }

        Asset asset = assetRepository.findById(requestDTO.getAssetId())
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", requestDTO.getAssetId()));

        String code = requestDTO.getPointAssetCode() != null ? requestDTO.getPointAssetCode().toUpperCase().trim() : "";
        if (!code.isEmpty() && pointAssetRepository.existsByPointAssetCode(code)) {
            throw new BusinessRuleViolationException("DUPLICATE_POINT_ASSET_CODE",
                    "A point asset with code '" + code + "' already exists.");
        }

        PointAsset entity = new PointAsset();
        entity.setAsset(asset);
        entity.setPointAssetCode(code);
        entity.setPointAssetName(requestDTO.getPointAssetName() != null ? requestDTO.getPointAssetName().trim() : "");
        entity.setPointAssetType(requestDTO.getPointAssetType() != null ? requestDTO.getPointAssetType().trim() : "Infrastructure");
        entity.setStartChainage(requestDTO.getStartChainage() != null ? requestDTO.getStartChainage() : requestDTO.getLocationChainage());
        entity.setStructureLengthMeters(requestDTO.getStructureLengthMeters());
        entity.setEndChainage(requestDTO.getEndChainage());
        entity.setLocationChainage(requestDTO.getLocationChainage() != null ? requestDTO.getLocationChainage() : requestDTO.getStartChainage());
        entity.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus().trim() : "ACTIVE");

        PointAsset saved = pointAssetRepository.save(entity);
        return toDto(saved);
    }

    @Override
    public void deletePointAsset(UUID id) {
        if (!pointAssetRepository.existsById(id)) {
            throw new ResourceNotFoundException("PointAsset", "id", id);
        }
        pointAssetRepository.deleteById(id);
    }

    private PointAssetResponseDTO toDto(PointAsset entity) {
        PointAssetResponseDTO dto = new PointAssetResponseDTO();
        dto.setId(entity.getId());
        if (entity.getAsset() != null) {
            dto.setAssetId(entity.getAsset().getId());
            dto.setAssetName(entity.getAsset().getAssetName());
        }
        dto.setPointAssetCode(entity.getPointAssetCode());
        dto.setPointAssetName(entity.getPointAssetName());
        dto.setPointAssetType(entity.getPointAssetType());
        dto.setStartChainage(entity.getStartChainage() != null ? entity.getStartChainage() : entity.getLocationChainage());
        dto.setStructureLengthMeters(entity.getStructureLengthMeters());
        dto.setEndChainage(entity.getEndChainage());
        dto.setLocationChainage(entity.getLocationChainage() != null ? entity.getLocationChainage() : entity.getStartChainage());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
