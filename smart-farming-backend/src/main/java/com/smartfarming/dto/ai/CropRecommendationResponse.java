package com.smartfarming.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CropRecommendationResponse {
    private String recommendedCrop;
    private Double confidence;
}
