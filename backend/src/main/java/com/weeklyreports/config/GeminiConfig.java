package com.weeklyreports.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

@Configuration
public class GeminiConfig {

    @Bean
    public RestClient geminiRestClient(
            @Value("${gemini.base-url}") String baseUrl,
            @Value("${gemini.api-key}") String apiKey
    ) {
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-goog-api-key", apiKey)
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}