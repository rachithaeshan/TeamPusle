package com.weeklyreports.service;

import com.weeklyreports.dto.project.ProjectRequest;
import com.weeklyreports.dto.project.ProjectResponse;
import com.weeklyreports.exception.DuplicateResourceException;
import com.weeklyreports.exception.ResourceNotFoundException;
import com.weeklyreports.model.Project;
import com.weeklyreports.model.User;
import com.weeklyreports.repository.ProjectRepository;
import com.weeklyreports.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAll() {
        return projectRepository.findAll().stream()
                .map(ProjectResponse::fromEntity)
                .toList();
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        if (projectRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("A project named '" + request.getName() + "' already exists");
        }

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .assignedMembers(resolveMembers(request.getAssignedMemberIds()))
                .build();

        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id " + id));

        boolean nameTaken = projectRepository.findByNameIgnoreCase(request.getName())
                .map(p -> !p.getId().equals(id))
                .orElse(false);
        if (nameTaken) {
            throw new DuplicateResourceException("A project named '" + request.getName() + "' already exists");
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        if (request.getAssignedMemberIds() != null) {
            project.setAssignedMembers(resolveMembers(request.getAssignedMemberIds()));
        }

        return ProjectResponse.fromEntity(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project not found with id " + id);
        }
        projectRepository.deleteById(id);
    }

    private Set<User> resolveMembers(List<Long> memberIds) {
        if (memberIds == null || memberIds.isEmpty()) {
            return new HashSet<>();
        }
        return new HashSet<>(userRepository.findAllById(memberIds));
    }
}
