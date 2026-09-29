package com.smartfarming.dto.crop;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropRecommendationResponse {
    private Long id;
    private Long seasonId;
    private String recommendedCrop;
    private Double confidenceScore;
    private String aiModelVersion;
    private LocalDateTime recommendedAt;
}
