package com.smartfarming.service;

import com.smartfarming.dto.ai.CropRecommendationRequest;
import com.smartfarming.dto.ai.CropRecommendationResponse;
import com.smartfarming.dto.ai.YieldPredictionRequest;
import com.smartfarming.dto.ai.YieldPredictionResponse;
import com.smartfarming.exception.AiServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class AiIntegrationService {

    private final RestTemplate restTemplate;
    private final String aiServiceUrl;

    public AiIntegrationService(RestTemplate restTemplate, @Value("${ai.service.url}") String aiServiceUrl) {
        this.restTemplate = restTemplate;
        this.aiServiceUrl = aiServiceUrl;
    }

    public CropRecommendationResponse getCropRecommendation(CropRecommendationRequest request) {
        String url = aiServiceUrl + "/ai/crop-recommendation";
        try {
            return restTemplate.postForObject(url, request, CropRecommendationResponse.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("Invalid data provided to AI service: " + e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            throw new AiServiceException("AI service is currently unavailable or timed out.");
        } catch (Exception e) {
            throw new AiServiceException("An unexpected error occurred while communicating with the AI service.");
        }
    }

    public YieldPredictionResponse getYieldPrediction(YieldPredictionRequest request) {
        String url = aiServiceUrl + "/ai/yield-prediction";
        try {
            return restTemplate.postForObject(url, request, YieldPredictionResponse.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("Invalid data provided to AI service: " + e.getResponseBodyAsString());
        } catch (ResourceAccessException e) {
            throw new AiServiceException("AI service is currently unavailable or timed out.");
        } catch (Exception e) {
            throw new AiServiceException("An unexpected error occurred while communicating with the AI service.");
        }
    }
}
