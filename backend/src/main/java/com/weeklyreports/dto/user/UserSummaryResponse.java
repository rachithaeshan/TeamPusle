package com.weeklyreports.dto.user;

import com.weeklyreports.model.Role;
import com.weeklyreports.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;

    public static UserSummaryResponse fromEntity(User u) {
        return UserSummaryResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .build();
    }
}
