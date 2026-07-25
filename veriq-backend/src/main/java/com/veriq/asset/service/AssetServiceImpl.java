package com.veriq.asset.service;

import com.veriq.asset.dto.AssetResponseDTO;
import com.veriq.asset.dto.CreateAssetRequestDTO;
import com.veriq.asset.dto.UpdateAssetRequestDTO;
import com.veriq.asset.entity.Asset;
import com.veriq.asset.mapper.AssetMapper;
import com.veriq.asset.repository.AssetRepository;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.project.entity.Project;
import com.veriq.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final ProjectRepository projectRepository;
    private final AssetMapper assetMapper;

    public AssetServiceImpl(AssetRepository assetRepository,
                            ProjectRepository projectRepository,
                            AssetMapper assetMapper) {
        this.assetRepository = assetRepository;
        this.projectRepository = projectRepository;
        this.assetMapper = assetMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetResponseDTO> getAllAssets() {
        return assetRepository.findAll().stream()
                .map(assetMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssetResponseDTO getAssetById(UUID id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", id));
        return assetMapper.toDto(asset);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetResponseDTO> getAssetsByProjectId(UUID projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project", "id", projectId);
        }
        return assetRepository.findByProjectId(projectId).stream()
                .map(assetMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssetResponseDTO createAsset(CreateAssetRequestDTO requestDTO) {
        if (requestDTO == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Asset payload is required.");
        }

        Project project = projectRepository.findById(requestDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", requestDTO.getProjectId()));

        String code = requestDTO.getAssetCode() != null ? requestDTO.getAssetCode().toUpperCase().trim() : "";
        String name = requestDTO.getAssetName() != null ? requestDTO.getAssetName().trim() : "";

        if (!code.isEmpty() && assetRepository.existsByAssetCode(code)) {
            throw new BusinessRuleViolationException("DUPLICATE_ASSET_CODE",
                    "An asset with code '" + code + "' already exists.");
        }
        if (!name.isEmpty() && assetRepository.existsByAssetName(name)) {
            throw new BusinessRuleViolationException("DUPLICATE_ASSET_NAME",
                    "An asset with name '" + name + "' already exists.");
        }

        Asset entity = assetMapper.toEntity(requestDTO, project);
        Asset savedEntity = assetRepository.save(entity);
        return assetMapper.toDto(savedEntity);
    }

    @Override
    public AssetResponseDTO updateAsset(UUID id, UpdateAssetRequestDTO requestDTO) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", id));

        Project project = projectRepository.findById(requestDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", requestDTO.getProjectId()));

        asset.setProject(project);
        asset.setAssetName(requestDTO.getAssetName() != null ? requestDTO.getAssetName().trim() : asset.getAssetName());
        asset.setAssetDescription(trimToNull(requestDTO.getAssetDescription()));
        asset.setAssetClass(requestDTO.getAssetClass() != null ? requestDTO.getAssetClass().trim() : asset.getAssetClass());
        asset.setAssetNature(requestDTO.getAssetNature() != null ? requestDTO.getAssetNature().trim() : asset.getAssetNature());

        if ("Linear".equalsIgnoreCase(asset.getAssetNature())) {
            asset.setStartChainage(requestDTO.getStartChainage());
            asset.setEndChainage(requestDTO.getEndChainage());
            if (requestDTO.getEndChainage() != null && requestDTO.getStartChainage() != null) {
                asset.setTotalLength(requestDTO.getEndChainage().subtract(requestDTO.getStartChainage()));
            } else {
                asset.setTotalLength(requestDTO.getTotalLength());
            }
        } else {
            asset.setStartChainage(null);
            asset.setEndChainage(null);
            asset.setTotalLength(null);
        }

        asset.setAssetStatus(requestDTO.getAssetStatus() != null ? requestDTO.getAssetStatus().trim() : asset.getAssetStatus());

        Asset updatedEntity = assetRepository.save(asset);
        return assetMapper.toDto(updatedEntity);
    }

    @Override
    public void deleteAsset(UUID id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset", "id", id);
        }
        assetRepository.deleteById(id);
    }

    private String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
