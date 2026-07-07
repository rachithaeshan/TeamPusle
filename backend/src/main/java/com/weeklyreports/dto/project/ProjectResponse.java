package com.weeklyreports.dto.project;

import com.weeklyreports.model.Project;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private List<String> assignedMemberNames;

    public static ProjectResponse fromEntity(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .assignedMemberNames(p.getAssignedMembers().stream()
                        .map(u -> u.getName())
                        .toList())
                .build();
    }
}
