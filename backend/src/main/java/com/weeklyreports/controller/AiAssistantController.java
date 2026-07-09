package com.weeklyreports.controller;

import com.weeklyreports.dto.assistant.ChatRequest;
import com.weeklyreports.dto.assistant.ChatResponse;
import com.weeklyreports.service.AiAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MANAGER')")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String reply = aiAssistantService.chat(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }

    @GetMapping("/summary")
    public ResponseEntity<ChatResponse> summary() {
        String summary = aiAssistantService.generateTeamSummary();
        return ResponseEntity.ok(new ChatResponse(summary));
    }
}