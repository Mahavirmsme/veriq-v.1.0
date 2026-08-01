package com.veriq.department.service;

import com.veriq.department.dto.CreateDepartmentPayloadDTO;
import com.veriq.department.dto.DepartmentDTO;
import com.veriq.department.dto.UpdateDepartmentPayloadDTO;

import java.util.List;
import java.util.UUID;

public interface DepartmentService {

    List<DepartmentDTO> getAllDepartments();

    DepartmentDTO getDepartmentById(UUID id);

    DepartmentDTO createDepartment(CreateDepartmentPayloadDTO payload);

    DepartmentDTO updateDepartment(UUID id, UpdateDepartmentPayloadDTO payload);

    void deleteDepartment(UUID id);
}
