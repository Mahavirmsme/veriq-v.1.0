package com.veriq.bootstrap.repository;

import com.veriq.bootstrap.entity.PlatformBootstrapRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlatformBootstrapRepository extends JpaRepository<PlatformBootstrapRecord, UUID> {
    Optional<PlatformBootstrapRecord> findFirstByOrderByCreatedAtAsc();
}
