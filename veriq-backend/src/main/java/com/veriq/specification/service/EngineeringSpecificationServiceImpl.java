package com.veriq.specification.service;

import com.veriq.specification.dto.AssetEngineeringSpecificationDTO;
import com.veriq.specification.entity.AssetEngineeringSpecification;
import com.veriq.specification.entity.NodeEngineeringGeometry;
import com.veriq.specification.entity.SensorEngineeringBaseline;
import com.veriq.specification.mapper.AssetEngineeringSpecificationMapper;
import com.veriq.specification.model.SpecificationApprovalStatus;
import com.veriq.specification.repository.AssetEngineeringSpecificationRepository;
import com.veriq.specification.repository.NodeEngineeringGeometryRepository;
import com.veriq.specification.repository.SensorEngineeringBaselineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class EngineeringSpecificationServiceImpl implements EngineeringSpecificationService {

    private final AssetEngineeringSpecificationRepository specificationRepository;
    private final NodeEngineeringGeometryRepository nodeGeometryRepository;
    private final SensorEngineeringBaselineRepository sensorBaselineRepository;

    public EngineeringSpecificationServiceImpl(AssetEngineeringSpecificationRepository specificationRepository,
                                               NodeEngineeringGeometryRepository nodeGeometryRepository,
                                               SensorEngineeringBaselineRepository sensorBaselineRepository) {
        this.specificationRepository = specificationRepository;
        this.nodeGeometryRepository = nodeGeometryRepository;
        this.sensorBaselineRepository = sensorBaselineRepository;
    }

    @Override
    public List<AssetEngineeringSpecificationDTO> getSpecificationsByAsset(UUID assetId) {
        List<AssetEngineeringSpecification> specs = specificationRepository.findByAssetId(assetId);
        return specs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public Optional<AssetEngineeringSpecificationDTO> getSpecificationByAssetAndVersion(UUID assetId, String version) {
        return specificationRepository.findByAssetIdAndSpecificationVersion(assetId, version)
                .map(this::mapToDTO);
    }

    @Override
    public List<AssetEngineeringSpecificationDTO> getSpecificationsByAssetAndStatus(UUID assetId, SpecificationApprovalStatus status) {
        List<AssetEngineeringSpecification> specs = specificationRepository.findByAssetIdAndApprovalStatus(assetId, status);
        return specs.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private AssetEngineeringSpecificationDTO mapToDTO(AssetEngineeringSpecification spec) {
        List<NodeEngineeringGeometry> geometries = nodeGeometryRepository.findBySpecificationId(spec.getId());
        List<SensorEngineeringBaseline> baselines = sensorBaselineRepository.findBySpecificationId(spec.getId());
        return AssetEngineeringSpecificationMapper.toDTO(spec, geometries, baselines);
    }
}
