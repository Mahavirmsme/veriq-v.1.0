package com.veriq.specification.mapper;

import com.veriq.specification.dto.AssetEngineeringSpecificationDTO;
import com.veriq.specification.dto.NodeEngineeringGeometryDTO;
import com.veriq.specification.dto.SensorEngineeringBaselineDTO;
import com.veriq.specification.entity.AssetEngineeringSpecification;
import com.veriq.specification.entity.NodeEngineeringGeometry;
import com.veriq.specification.entity.SensorEngineeringBaseline;

import java.util.List;
import java.util.stream.Collectors;

public class AssetEngineeringSpecificationMapper {

    public static AssetEngineeringSpecificationDTO toDTO(AssetEngineeringSpecification entity,
                                                          List<NodeEngineeringGeometry> geometries,
                                                          List<SensorEngineeringBaseline> baselines) {
        if (entity == null) {
            return null;
        }

        AssetEngineeringSpecificationDTO dto = new AssetEngineeringSpecificationDTO();
        dto.setId(entity.getId());
        if (entity.getAsset() != null) {
            dto.setAssetId(entity.getAsset().getId());
        }
        dto.setSpecificationName(entity.getSpecificationName());
        dto.setSpecificationVersion(entity.getSpecificationVersion());
        dto.setApprovalStatus(entity.getApprovalStatus());

        dto.setSourceDocument(entity.getSourceDocument());
        dto.setIssuingAuthority(entity.getIssuingAuthority());
        dto.setApprovingAuthority(entity.getApprovingAuthority());
        dto.setApprovalReference(entity.getApprovalReference());

        dto.setEffectiveFrom(entity.getEffectiveFrom());
        dto.setEffectiveTo(entity.getEffectiveTo());

        dto.setCohesionEffective(entity.getCohesionEffective());
        dto.setFrictionAngleEffective(entity.getFrictionAngleEffective());
        dto.setSoilUnitWeight(entity.getSoilUnitWeight());
        dto.setSaturatedUnitWeight(entity.getSaturatedUnitWeight());
        dto.setHydraulicConductivity(entity.getHydraulicConductivity());
        dto.setCriticalHydraulicGradient(entity.getCriticalHydraulicGradient());

        dto.setCrestElevation(entity.getCrestElevation());
        dto.setFreeboardMinimum(entity.getFreeboardMinimum());

        dto.setFosRequiredNormal(entity.getFosRequiredNormal());
        dto.setFosRequiredWarning(entity.getFosRequiredWarning());
        dto.setFosRequiredCritical(entity.getFosRequiredCritical());

        dto.setDesignSignificantWaveHeight(entity.getDesignSignificantWaveHeight());
        dto.setDesignPeakWavePeriod(entity.getDesignPeakWavePeriod());
        dto.setUnsaturatedFrictionAngle(entity.getUnsaturatedFrictionAngle());

        dto.setMethodologyReference(entity.getMethodologyReference());
        dto.setRemarks(entity.getRemarks());

        if (geometries != null) {
            dto.setNodeGeometries(geometries.stream().map(AssetEngineeringSpecificationMapper::toNodeGeometryDTO).collect(Collectors.toList()));
        }

        if (baselines != null) {
            dto.setSensorBaselines(baselines.stream().map(AssetEngineeringSpecificationMapper::toSensorBaselineDTO).collect(Collectors.toList()));
        }

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public static NodeEngineeringGeometryDTO toNodeGeometryDTO(NodeEngineeringGeometry entity) {
        if (entity == null) {
            return null;
        }

        NodeEngineeringGeometryDTO dto = new NodeEngineeringGeometryDTO();
        dto.setId(entity.getId());
        if (entity.getSpecification() != null) {
            dto.setSpecificationId(entity.getSpecification().getId());
        }
        if (entity.getEngineeringNode() != null) {
            dto.setEngineeringNodeId(entity.getEngineeringNode().getId());
            dto.setNodeCode(entity.getEngineeringNode().getNodeCode());
        }
        dto.setPiezometerTipElevation(entity.getPiezometerTipElevation());
        dto.setSlopeHeight(entity.getSlopeHeight());
        dto.setSlopeAngle(entity.getSlopeAngle());
        dto.setCrestWidth(entity.getCrestWidth());
        dto.setToeElevation(entity.getToeElevation());
        dto.setSeepagePathLength(entity.getSeepagePathLength());
        dto.setFoundationEmbedmentDepth(entity.getFoundationEmbedmentDepth());
        dto.setSensorSpanDistance(entity.getSensorSpanDistance());
        dto.setRemarks(entity.getRemarks());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }

    public static SensorEngineeringBaselineDTO toSensorBaselineDTO(SensorEngineeringBaseline entity) {
        if (entity == null) {
            return null;
        }

        SensorEngineeringBaselineDTO dto = new SensorEngineeringBaselineDTO();
        dto.setId(entity.getId());
        if (entity.getSpecification() != null) {
            dto.setSpecificationId(entity.getSpecification().getId());
        }
        if (entity.getRuntimeSensor() != null) {
            dto.setRuntimeSensorId(entity.getRuntimeSensor().getId());
            dto.setSensorCode(entity.getRuntimeSensor().getSensorCode());
        }
        dto.setBaselineValue(entity.getBaselineValue());
        dto.setBaselineUnit(entity.getBaselineUnit());
        dto.setParameterType(entity.getParameterType());
        dto.setCalibrationReference(entity.getCalibrationReference());
        dto.setCalibrationDate(entity.getCalibrationDate());
        dto.setRemarks(entity.getRemarks());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());

        return dto;
    }
}
