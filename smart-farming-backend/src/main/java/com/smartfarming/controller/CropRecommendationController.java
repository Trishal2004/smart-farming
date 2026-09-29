package com.smartfarming.controller;

import com.smartfarming.dto.crop.CropRecommendationResponse;
import com.smartfarming.service.CropRecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crop-recommendations")
@RequiredArgsConstructor
public class CropRecommendationController {

    private final CropRecommendationService recommendationService;

    @PostMapping("/generate/season/{seasonId}")
    public ResponseEntity<CropRecommendationResponse> generateRecommendation(@PathVariable Long seasonId) {
        return new ResponseEntity<>(recommendationService.generateRecommendation(seasonId), HttpStatus.CREATED);
    }

    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<CropRecommendationResponse>> getRecommendationsBySeasonId(@PathVariable Long seasonId) {
        return ResponseEntity.ok(recommendationService.getRecommendationsBySeasonId(seasonId));
    }
}
