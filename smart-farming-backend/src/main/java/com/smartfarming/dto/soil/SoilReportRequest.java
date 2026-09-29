package com.smartfarming.dto.soil;

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
public class SoilReportRequest {
    @NotNull(message = "Nitrogen level is required")
    @PositiveOrZero(message = "Nitrogen cannot be negative")
    private Double nitrogen;

    @NotNull(message = "Phosphorus level is required")
    @PositiveOrZero(message = "Phosphorus cannot be negative")
    private Double phosphorus;

    @NotNull(message = "Potassium level is required")
    @PositiveOrZero(message = "Potassium cannot be negative")
    private Double potassium;

    @NotNull(message = "pH level is required")
    @Min(value = 0, message = "pH must be at least 0")
    @Max(value = 14, message = "pH cannot exceed 14")
    private Double phLevel;

    @NotNull(message = "Temperature is required")
    @Min(value = -20, message = "Temperature is too low")
    @Max(value = 60, message = "Temperature is too high")
    private Double temperature;

    @NotNull(message = "Humidity is required")
    @Min(value = 0, message = "Humidity cannot be less than 0")
    @Max(value = 100, message = "Humidity cannot exceed 100")
    private Double humidity;

    @NotNull(message = "Rainfall is required")
    @PositiveOrZero(message = "Rainfall cannot be negative")
    private Double rainfall;
}
