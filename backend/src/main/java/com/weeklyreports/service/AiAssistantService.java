package com.weeklyreports.service;

import com.weeklyreports.dto.assistant.GeminiResponse;
import com.weeklyreports.exception.AiServiceException;
import com.weeklyreports.model.WeeklyReport;
import com.weeklyreports.repository.WeeklyReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiAssistantService {

    private static final int LOOKBACK_WEEKS = 4;

    private static final String SYSTEM_PROMPT = """
            You are an assistant embedded in a team weekly-report dashboard, helping an engineering
            manager understand their team's recent activity. You will be given a plain-text export of
            weekly reports (author, project, week, status, hours, completed tasks, planned tasks,
            blockers) followed by a question or instruction.

            Rules:
            - Only use the data provided. Do not invent tasks, blockers, or names that are not present.
            - If the data doesn't answer the question, say so plainly rather than guessing.
            - Be concise and skimmable - use short paragraphs or bullet points.
            - When asked about a specific person or project, filter to only the relevant lines.
            """;

    private final WeeklyReportRepository reportRepository;
    private final RestClient geminiRestClient;

    @Value("${gemini.model}")
    private String model;

    @Transactional(readOnly = true)
    public String chat(String userMessage) {
        String context = buildContext();
        String userPrompt = context + "\n\nManager's question: " + userMessage;
        return callGemini(userPrompt);
    }

    @Transactional(readOnly = true)
    public String generateTeamSummary() {
        String context = buildContext();
        String instruction = """

                Based on the data above, write a short team summary with three sections:
                1. Completed work highlights
                2. Recurring blockers
                3. Workload imbalances (who seems overloaded or under-reported)
                Keep the whole thing under 200 words.
                """;
        return callGemini(context + instruction);
    }

    private String buildContext() {
        LocalDate since = LocalDate.now().minusWeeks(LOOKBACK_WEEKS);
        List<WeeklyReport> reports = reportRepository.search(null, null, null, since, null);

        if (reports.isEmpty()) {
            return "No weekly reports have been submitted in the last " + LOOKBACK_WEEKS + " weeks.";
        }

        StringBuilder sb = new StringBuilder(
                "Team weekly reports from the last " + LOOKBACK_WEEKS + " weeks:\n");

        for (WeeklyReport r : reports) {
            sb.append("- ").append(r.getUser().getName())
                    .append(" | Project: ").append(r.getProject().getName())
                    .append(" | Week: ").append(r.getWeekStartDate()).append(" to ").append(r.getWeekEndDate())
                    .append(" | Status: ").append(r.getStatus())
                    .append(" | Hours: ").append(r.getHoursWorked() != null ? r.getHoursWorked() : "n/a")
                    .append(" | Completed: ").append(orDash(r.getTasksCompleted()))
                    .append(" | Planned next: ").append(orDash(r.getTasksPlannedNextWeek()))
                    .append(" | Blockers: ").append(orDash(r.getBlockers()))
                    .append("\n");
        }
        return sb.toString();
    }

    private String orDash(String value) {
        return (value == null || value.isBlank()) ? "-" : value;
    }

    private String callGemini(String userPrompt) {
        Map<String, Object> body = Map.of(
                "systemInstruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))
                ),
                "generationConfig", Map.of("temperature", 0.3)
        );

        try {
            GeminiResponse response = geminiRestClient.post()
                    .uri("/models/{model}:generateContent", model)
                    .body(body)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
                throw new AiServiceException("The AI assistant returned an empty response. Please try again.");
            }

            List<GeminiResponse.Part> parts = response.candidates().get(0).content().parts();
            if (parts == null || parts.isEmpty()) {
                throw new AiServiceException("The AI assistant returned an empty response. Please try again.");
            }

            return parts.get(0).text();

        } catch (RestClientException ex) {
            throw new AiServiceException(
                    "Couldn't reach the AI assistant. Check that GEMINI_API_KEY is set and valid.", ex);
        }
    }
}