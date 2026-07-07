package com.weeklyreports.repository;

import com.weeklyreports.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Project> findByNameIgnoreCase(String name);
}
