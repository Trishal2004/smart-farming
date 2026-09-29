package com.smartfarming.dto.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CropRecommendationRequest {
    @NotNull @PositiveOrZero private Double nitrogen;
    @NotNull @PositiveOrZero private Double phosphorus;
    @NotNull @PositiveOrZero private Double potassium;
    @NotNull @Min(0) @Max(14) private Double ph;
    @NotNull @Min(-20) @Max(60) private Double temperature;
    @NotNull @Min(0) @Max(100) private Double humidity;
    @NotNull @PositiveOrZero private Double rainfall;
}
