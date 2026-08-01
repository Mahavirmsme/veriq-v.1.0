package com.veriq.designation.service;

import com.veriq.designation.dto.CreateDesignationPayloadDTO;
import com.veriq.designation.dto.DesignationDTO;
import com.veriq.designation.dto.UpdateDesignationPayloadDTO;

import java.util.List;
import java.util.UUID;

public interface DesignationService {

    List<DesignationDTO> getAllDesignations();

    DesignationDTO getDesignationById(UUID id);

    DesignationDTO createDesignation(CreateDesignationPayloadDTO payload);

    DesignationDTO updateDesignation(UUID id, UpdateDesignationPayloadDTO payload);

    void deleteDesignation(UUID id);
}
