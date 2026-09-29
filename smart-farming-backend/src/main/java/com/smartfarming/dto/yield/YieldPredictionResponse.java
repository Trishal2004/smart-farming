package com.smartfarming.dto.yield;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YieldPredictionResponse {
    private Long id;
    private Long seasonId;
    private Double predictedYieldTons;
    private Double confidenceScore;
    private LocalDate predictionDate;
}
