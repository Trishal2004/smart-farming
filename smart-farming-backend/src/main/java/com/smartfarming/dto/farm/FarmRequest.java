package com.smartfarming.dto.farm;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmRequest {
    @NotBlank(message = "Farm name is required")
    private String name;

    private String location;

    @Positive(message = "Area size must be positive")
    private Double areaSizeHectares;

    private String primarySoilType;
}
