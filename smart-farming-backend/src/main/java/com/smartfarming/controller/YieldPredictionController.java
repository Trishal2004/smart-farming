package com.smartfarming.controller;

import com.smartfarming.dto.yield.YieldPredictionResponse;
import com.smartfarming.service.YieldPredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/yield-predictions")
@RequiredArgsConstructor
public class YieldPredictionController {

    private final YieldPredictionService predictionService;

    @PostMapping("/generate/season/{seasonId}")
    public ResponseEntity<YieldPredictionResponse> generatePrediction(@PathVariable Long seasonId) {
        return new ResponseEntity<>(predictionService.generatePrediction(seasonId), HttpStatus.CREATED);
    }

    @GetMapping("/season/{seasonId}")
    public ResponseEntity<List<YieldPredictionResponse>> getPredictionsBySeasonId(@PathVariable Long seasonId) {
        return ResponseEntity.ok(predictionService.getPredictionsBySeasonId(seasonId));
    }
}
