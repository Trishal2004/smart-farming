package com.smartfarming.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class YieldPredictionRequest {
    @NotBlank private String crop;
    @NotNull @Positive private Double landArea;
    @NotNull @PositiveOrZero private Double rainfall;
    @NotNull @PositiveOrZero private Double fertilizerUsage;
    @NotNull @PositiveOrZero private Double previousYield;
}
