package com.smartfarming.controller;

import com.smartfarming.dto.ai.CropRecommendationRequest;
import com.smartfarming.dto.ai.CropRecommendationResponse;
import com.smartfarming.dto.ai.YieldPredictionRequest;
import com.smartfarming.dto.ai.YieldPredictionResponse;
import com.smartfarming.service.AiIntegrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiIntegrationService aiIntegrationService;

    @PostMapping("/crop-recommendation")
    public ResponseEntity<CropRecommendationResponse> getCropRecommendation(@Valid @RequestBody CropRecommendationRequest request) {
        return ResponseEntity.ok(aiIntegrationService.getCropRecommendation(request));
    }

    @PostMapping("/yield-prediction")
    public ResponseEntity<YieldPredictionResponse> getYieldPrediction(@Valid @RequestBody YieldPredictionRequest request) {
        return ResponseEntity.ok(aiIntegrationService.getYieldPrediction(request));
    }
}
