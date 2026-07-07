package com.weeklyreports.controller;

import com.weeklyreports.dto.user.UserSummaryResponse;
import com.weeklyreports.model.Role;
import com.weeklyreports.repository.UserRepository;
import com.weeklyreports.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final CurrentUserProvider currentUserProvider;

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('TEAM_MEMBER','MANAGER')")
    public ResponseEntity<UserSummaryResponse> me() {
        return ResponseEntity.ok(UserSummaryResponse.fromEntity(currentUserProvider.getCurrentUser()));
    }

    @GetMapping("/team-members")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<UserSummaryResponse>> teamMembers() {
        List<UserSummaryResponse> members = userRepository.findByRole(Role.TEAM_MEMBER).stream()
                .map(UserSummaryResponse::fromEntity)
                .toList();
        return ResponseEntity.ok(members);
    }
}
