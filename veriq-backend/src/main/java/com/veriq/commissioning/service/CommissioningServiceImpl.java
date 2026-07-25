package com.veriq.commissioning.service;

import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.commissioning.dto.CommissioningRecordResponseDTO;
import com.veriq.commissioning.dto.CompleteCommissioningRequestDTO;
import com.veriq.commissioning.entity.CommissioningRecord;
import com.veriq.commissioning.entity.RuntimeSensor;
import com.veriq.commissioning.mapper.CommissioningMapper;
import com.veriq.commissioning.repository.CommissioningRecordRepository;
import com.veriq.commissioning.repository.RuntimeSensorRepository;
import com.veriq.engineeringnode.entity.EngineeringNode;
import com.veriq.engineeringnode.repository.EngineeringNodeRepository;
import com.veriq.runtimesensor.entity.RuntimeSensorTransitionLog;
import com.veriq.runtimesensor.repository.RuntimeSensorTransitionLogRepository;
import com.veriq.sensorpackage.entity.SensorPackage;
import com.veriq.sensorpackage.entity.SensorPackageItem;
import com.veriq.sensorpackage.repository.SensorPackageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.*;

@Service
@Transactional
public class CommissioningServiceImpl implements CommissioningService {

    private final CommissioningRecordRepository commissioningRecordRepository;
    private final RuntimeSensorRepository runtimeSensorRepository;
    private final EngineeringNodeRepository engineeringNodeRepository;
    private final SensorPackageRepository sensorPackageRepository;
    private final RuntimeSensorTransitionLogRepository transitionLogRepository;
    private final CommissioningMapper commissioningMapper;

    public CommissioningServiceImpl(CommissioningRecordRepository commissioningRecordRepository,
                                   RuntimeSensorRepository runtimeSensorRepository,
                                   EngineeringNodeRepository engineeringNodeRepository,
                                   SensorPackageRepository sensorPackageRepository,
                                   RuntimeSensorTransitionLogRepository transitionLogRepository,
                                   CommissioningMapper commissioningMapper) {
        this.commissioningRecordRepository = commissioningRecordRepository;
        this.runtimeSensorRepository = runtimeSensorRepository;
        this.engineeringNodeRepository = engineeringNodeRepository;
        this.sensorPackageRepository = sensorPackageRepository;
        this.transitionLogRepository = transitionLogRepository;
        this.commissioningMapper = commissioningMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public CommissioningRecordResponseDTO getCommissioningByNodeId(UUID engineeringNodeId) {
        if (!engineeringNodeRepository.existsById(engineeringNodeId)) {
            throw new ResourceNotFoundException("EngineeringNode", "id", engineeringNodeId);
        }
        return commissioningRecordRepository.findByEngineeringNodeId(engineeringNodeId)
                .map(commissioningMapper::toDto)
                .orElse(null);
    }

    @Override
    public CommissioningRecordResponseDTO startCommissioning(UUID engineeringNodeId) {
        EngineeringNode node = engineeringNodeRepository.findById(engineeringNodeId)
                .orElseThrow(() -> new ResourceNotFoundException("EngineeringNode", "id", engineeringNodeId));

        SensorPackage pkg = sensorPackageRepository.findByEngineeringNodeId(engineeringNodeId)
                .orElseThrow(() -> new BusinessRuleViolationException("MISSING_SENSOR_PACKAGE",
                        "Cannot start commissioning. Target Engineering Node has no saved Sensor Package design."));

        Optional<CommissioningRecord> existingOpt = commissioningRecordRepository.findByEngineeringNodeId(engineeringNodeId);
        CommissioningRecord record;
        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            if ("COMMISSIONED".equalsIgnoreCase(record.getStatus())) {
                throw new BusinessRuleViolationException("ALREADY_COMMISSIONED",
                        "Commissioning is already completed and locked for this Engineering Node.");
            }
            record.setStatus("IN_PROGRESS");
        } else {
            record = new CommissioningRecord();
            record.setEngineeringNode(node);
            record.setSensorPackage(pkg);
            record.setStatus("IN_PROGRESS");
        }

        CommissioningRecord saved = commissioningRecordRepository.save(record);
        return commissioningMapper.toDto(saved);
    }

    @Override
    public CommissioningRecordResponseDTO completeCommissioning(CompleteCommissioningRequestDTO requestDTO) {
        if (requestDTO == null || requestDTO.getEngineeringNodeId() == null) {
            throw new BusinessRuleViolationException("INVALID_INPUT", "Engineering Node ID is required.");
        }

        UUID nodeId = requestDTO.getEngineeringNodeId();
        EngineeringNode node = engineeringNodeRepository.findById(nodeId)
                .orElseThrow(() -> new ResourceNotFoundException("EngineeringNode", "id", nodeId));

        SensorPackage pkg = sensorPackageRepository.findByEngineeringNodeId(nodeId)
                .orElseThrow(() -> new BusinessRuleViolationException("MISSING_SENSOR_PACKAGE",
                        "Cannot complete commissioning. Target Engineering Node has no saved Sensor Package design."));

        if (pkg.getItems() == null || pkg.getItems().isEmpty()) {
            throw new BusinessRuleViolationException("EMPTY_SENSOR_PACKAGE",
                    "Cannot complete commissioning. Sensor Package contains no sensor type specifications.");
        }

        CommissioningRecord record = commissioningRecordRepository.findByEngineeringNodeId(nodeId)
                .orElseGet(() -> {
                    CommissioningRecord newRec = new CommissioningRecord();
                    newRec.setEngineeringNode(node);
                    newRec.setSensorPackage(pkg);
                    return newRec;
                });

        record.setStatus("COMMISSIONED");
        record.setCommissionedDate(OffsetDateTime.now());
        if (requestDTO.getRemarks() != null) {
            record.setRemarks(requestDTO.getRemarks());
        }

        // Delete existing runtime sensors for this record before regenerating
        record.getRuntimeSensors().clear();

        List<RuntimeSensor> generatedSensors = new ArrayList<>();

        // Generate Runtime Sensors for each SensorPackageItem
        for (SensorPackageItem item : pkg.getItems()) {
            String prefix = getSensorCodePrefix(item.getSensorType());
            int quantity = item.getQuantity() != null && item.getQuantity() > 0 ? item.getQuantity() : 1;

            for (int i = 1; i <= quantity; i++) {
                String code = String.format("%s-%04d", prefix, i);
                int counter = i;
                while (runtimeSensorRepository.existsBySensorCode(code)) {
                    counter++;
                    code = String.format("%s-%04d", prefix, counter);
                }

                RuntimeSensor sensor = new RuntimeSensor();
                sensor.setCommissioningRecord(record);
                sensor.setEngineeringNode(node);
                sensor.setSensorCode(code);
                sensor.setSensorType(item.getSensorType());
                sensor.setMeasurementParameter(item.getMeasurementParameter());
                sensor.setSensorStatus("PROVISIONED");

                record.addRuntimeSensor(sensor);
                generatedSensors.add(sensor);
            }
        }

        CommissioningRecord saved = commissioningRecordRepository.save(record);

        // Record Initial Audit Logs for each generated Runtime Sensor
        for (RuntimeSensor s : saved.getRuntimeSensors()) {
            RuntimeSensorTransitionLog log = new RuntimeSensorTransitionLog();
            log.setRuntimeSensor(s);
            log.setPreviousState("NONE");
            log.setNewState("PROVISIONED");
            log.setTransitionOwner("Commissioning Service");
            log.setReason("Runtime Sensor Created from Commissioning Artifact");
            log.setCreatedAt(OffsetDateTime.now());
            transitionLogRepository.save(log);
        }

        return commissioningMapper.toDto(saved);
    }

    private String getSensorCodePrefix(String sensorType) {
        if (sensorType == null) return "RS";
        String lower = sensorType.toLowerCase();
        if (lower.contains("tilt")) return "TS";
        if (lower.contains("piezo")) return "PZ";
        if (lower.contains("soil moisture")) return "SM";
        if (lower.contains("inclinometer")) return "INC";
        if (lower.contains("accelerometer")) return "ACC";
        if (lower.contains("rain")) return "RG";
        if (lower.contains("water level")) return "WL";
        if (lower.contains("strain")) return "SG";
        if (lower.contains("load")) return "LC";
        if (lower.contains("vibration")) return "VS";
        if (lower.contains("crack")) return "CM";
        if (lower.contains("temperature")) return "ST";
        
        String clean = sensorType.replaceAll("[^a-zA-Z]", "").toUpperCase();
        return clean.length() >= 2 ? clean.substring(0, 2) : "RS";
    }
}
