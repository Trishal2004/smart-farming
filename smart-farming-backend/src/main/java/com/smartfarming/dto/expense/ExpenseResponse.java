package com.smartfarming.dto.expense;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {
    private Long id;
    private Long seasonId;
    private Double seedCost;
    private Double fertilizerCost;
    private Double labourCost;
    private Double irrigationCost;
    private Double electricityCost;
    private Double transportCost;
    private Double pesticideCost;
    private Double otherExpenses;
    private Double totalInvestment;
    private LocalDateTime createdAt;
}
