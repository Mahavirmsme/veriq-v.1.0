package com.veriq.bootstrap.service;

import com.veriq.bootstrap.dto.BootstrapRequestDTO;
import com.veriq.bootstrap.dto.BootstrapStatusDTO;

public interface PlatformBootstrapService {
    BootstrapStatusDTO getBootstrapStatus();
    BootstrapStatusDTO initializePlatform(BootstrapRequestDTO request);
}
