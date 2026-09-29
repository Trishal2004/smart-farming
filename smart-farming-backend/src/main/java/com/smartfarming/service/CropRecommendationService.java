package com.smartfarming.service;

import com.smartfarming.dto.crop.CropRecommendationResponse;
import com.smartfarming.entity.CropRecommendation;
import com.smartfarming.entity.Season;
import com.smartfarming.exception.ResourceNotFoundException;
import com.smartfarming.repository.CropRecommendationRepository;
import com.smartfarming.repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CropRecommendationService {

    private final CropRecommendationRepository cropRecommendationRepository;
    private final SeasonRepository seasonRepository;

    // Placeholder method for AI Python service integration
    public CropRecommendationResponse generateRecommendation(Long seasonId) {
        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new ResourceNotFoundException("Season not found"));

        // TODO: Call Python AI Service here instead of hardcoding
        
        CropRecommendation recommendation = CropRecommendation.builder()
                .season(season)
                .recommendedCrop("Wheat") // Placeholder
                .confidenceScore(0.95)   // Placeholder
                .aiModelVersion("v1.0")
                .build();

        recommendation = cropRecommendationRepository.save(recommendation);
        return mapToResponse(recommendation);
    }

    public List<CropRecommendationResponse> getRecommendationsBySeasonId(Long seasonId) {
        return cropRecommendationRepository.findBySeasonId(seasonId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CropRecommendationResponse mapToResponse(CropRecommendation rec) {
        return CropRecommendationResponse.builder()
                .id(rec.getId())
                .seasonId(rec.getSeason().getId())
                .recommendedCrop(rec.getRecommendedCrop())
                .confidenceScore(rec.getConfidenceScore())
                .aiModelVersion(rec.getAiModelVersion())
                .recommendedAt(rec.getRecommendedAt())
                .build();
    }
}
