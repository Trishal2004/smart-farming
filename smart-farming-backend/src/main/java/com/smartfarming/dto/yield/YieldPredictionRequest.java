package com.smartfarming.dto.yield;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YieldPredictionRequest {
    @NotNull(message = "Predicted yield is required")
    @PositiveOrZero(message = "Cannot be negative")
    private Double predictedYieldTons;

    private Double confidenceScore;

    @NotNull(message = "Prediction date is required")
    private LocalDate predictionDate;
}
