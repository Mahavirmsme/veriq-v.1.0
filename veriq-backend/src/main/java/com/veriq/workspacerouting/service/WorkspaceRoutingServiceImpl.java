package com.veriq.workspacerouting.service;

import com.veriq.userrole.entity.UserRole;
import com.veriq.userrole.repository.UserRoleRepository;
import com.veriq.workspacerouting.dto.WorkspaceRoutingRequestDTO;
import com.veriq.workspacerouting.dto.WorkspaceRoutingResponseDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class WorkspaceRoutingServiceImpl implements WorkspaceRoutingService {

    private final UserRoleRepository userRoleRepository;

    public WorkspaceRoutingServiceImpl(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    @Override
    public WorkspaceRoutingResponseDTO resolveWorkspace(WorkspaceRoutingRequestDTO request) {
        UUID userId = request.getUserId();

        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);
        Set<String> roleCodes = new HashSet<>();

        for (UserRole ur : userRoles) {
            if (ur.getRole() != null) {
                roleCodes.add(ur.getRole().getRoleCode());
            }
        }

        // Default to ADMIN for unassigned / system administrator accounts
        if (roleCodes.isEmpty()) {
            roleCodes.add("ADMIN");
        }

        Set<String> workspaces = new LinkedHashSet<>();

        if (roleCodes.contains("ADMIN")) {
            workspaces.add("administration");
            workspaces.add("configuration");
            workspaces.add("operations");
        } else {
            if (roleCodes.contains("CONFIG_ENGINEER")) {
                workspaces.add("configuration");
                workspaces.add("operations");
            }
            if (roleCodes.contains("CHIEF_ENGINEER") || roleCodes.contains("ASSET_MANAGER") 
                    || roleCodes.contains("REGIONAL_ENGINEER") || roleCodes.contains("FIELD_ENGINEER")) {
                workspaces.add("operations");
            }
        }

        if (workspaces.isEmpty()) {
            workspaces.add("operations");
        }

        List<String> workspaceList = new ArrayList<>(workspaces);

        boolean selectionRequired = workspaceList.size() > 1;
        String defaultWorkspace = selectionRequired ? null : workspaceList.get(0);

        return new WorkspaceRoutingResponseDTO(userId, workspaceList, defaultWorkspace, selectionRequired);
    }
}
