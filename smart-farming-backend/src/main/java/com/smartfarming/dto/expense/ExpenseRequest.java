package com.smartfarming.dto.expense;

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
public class ExpenseRequest {
    
    @NotNull(message = "Seed cost is required")
    @PositiveOrZero(message = "Seed cost cannot be negative")
    private Double seedCost;

    @NotNull(message = "Fertilizer cost is required")
    @PositiveOrZero(message = "Fertilizer cost cannot be negative")
    private Double fertilizerCost;

    @NotNull(message = "Labour cost is required")
    @PositiveOrZero(message = "Labour cost cannot be negative")
    private Double labourCost;

    @NotNull(message = "Irrigation cost is required")
    @PositiveOrZero(message = "Irrigation cost cannot be negative")
    private Double irrigationCost;

    @NotNull(message = "Electricity cost is required")
    @PositiveOrZero(message = "Electricity cost cannot be negative")
    private Double electricityCost;

    @NotNull(message = "Transport cost is required")
    @PositiveOrZero(message = "Transport cost cannot be negative")
    private Double transportCost;

    @NotNull(message = "Pesticide cost is required")
    @PositiveOrZero(message = "Pesticide cost cannot be negative")
    private Double pesticideCost;

    @NotNull(message = "Other expenses is required")
    @PositiveOrZero(message = "Other expenses cannot be negative")
    private Double otherExpenses;
}
