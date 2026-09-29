package com.smartfarming.service;

import com.smartfarming.dto.yield.YieldPredictionResponse;
import com.smartfarming.entity.Season;
import com.smartfarming.entity.YieldPrediction;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.repository.SeasonRepository;
import com.smartfarming.repository.YieldPredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YieldPredictionService {

    private final YieldPredictionRepository yieldPredictionRepository;
    private final SeasonRepository seasonRepository;

    // Placeholder method for AI Python service integration
    public YieldPredictionResponse generatePrediction(Long seasonId) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new ResourceNotFoundException("Season not found"));

        // TODO: Call Python AI Service to get yield predictions
        
        YieldPrediction prediction = YieldPrediction.builder()
                .season(season)
                .predictedYieldTons(12.5) // Placeholder
                .confidenceScore(0.88)   // Placeholder
                .predictionDate(LocalDate.now())
                .build();

        prediction = yieldPredictionRepository.save(prediction);
        return mapToResponse(prediction);
    }

    public List<YieldPredictionResponse> getPredictionsBySeasonId(Long seasonId) {
        return yieldPredictionRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private YieldPredictionResponse mapToResponse(YieldPrediction prediction) {
        return YieldPredictionResponse.builder()
                .id(prediction.getId())
                .seasonId(prediction.getSeason().getId())
                .predictedYieldTons(prediction.getPredictedYieldTons())
                .confidenceScore(prediction.getConfidenceScore())
                .predictionDate(prediction.getPredictionDate())
                .build();
    }
}
