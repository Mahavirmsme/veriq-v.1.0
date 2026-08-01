package com.veriq.department.service;

import com.veriq.common.context.TenantContextResolver;
import com.veriq.common.exception.BusinessRuleViolationException;
import com.veriq.common.exception.ResourceNotFoundException;
import com.veriq.department.dto.CreateDepartmentPayloadDTO;
import com.veriq.department.dto.DepartmentDTO;
import com.veriq.department.dto.UpdateDepartmentPayloadDTO;
import com.veriq.department.entity.Department;
import com.veriq.department.mapper.DepartmentMapper;
import com.veriq.department.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final TenantContextResolver tenantContextResolver;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                 DepartmentMapper departmentMapper,
                                 TenantContextResolver tenantContextResolver) {
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
        this.tenantContextResolver = tenantContextResolver;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartments() {
        UUID organizationId = requireTenantContext();
        return departmentRepository.findByOrganizationId(organizationId).stream()
                .map(departmentMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(UUID id) {
        UUID organizationId = requireTenantContext();
        Department department = departmentRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return departmentMapper.toDto(department);
    }

    @Override
    public DepartmentDTO createDepartment(CreateDepartmentPayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        String code = payload.getCode().trim().toUpperCase();

        if (departmentRepository.existsByOrganizationIdAndCode(organizationId, code)) {
            throw new BusinessRuleViolationException("DEPARTMENT_CODE_EXISTS", 
                    "A department with code '" + code + "' already exists in this organization.");
        }

        Department department = departmentMapper.toEntity(payload);
        department.setOrganizationId(organizationId);

        Department saved = departmentRepository.save(department);
        return departmentMapper.toDto(saved);
    }

    @Override
    public DepartmentDTO updateDepartment(UUID id, UpdateDepartmentPayloadDTO payload) {
        UUID organizationId = requireTenantContext();
        Department department = departmentRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        String newCode = payload.getCode().trim().toUpperCase();
        if (!department.getCode().equalsIgnoreCase(newCode) &&
                departmentRepository.existsByOrganizationIdAndCode(organizationId, newCode)) {
            throw new BusinessRuleViolationException("DEPARTMENT_CODE_EXISTS",
                    "A department with code '" + newCode + "' already exists in this organization.");
        }

        department.setName(payload.getName().trim());
        department.setCode(newCode);
        if (payload.getStatus() != null) {
            department.setStatus(payload.getStatus());
        }

        Department saved = departmentRepository.save(department);
        return departmentMapper.toDto(saved);
    }

    @Override
    public void deleteDepartment(UUID id) {
        UUID organizationId = requireTenantContext();
        Department department = departmentRepository.findByIdAndOrganizationId(id, organizationId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        departmentRepository.delete(department);
    }

    private UUID requireTenantContext() {
        return tenantContextResolver.resolveCurrentOrganizationId()
                .orElseThrow(() -> new BusinessRuleViolationException("TENANT_CONTEXT_MISSING",
                        "Operation rejected: Active organization tenant context is required."));
    }
}
