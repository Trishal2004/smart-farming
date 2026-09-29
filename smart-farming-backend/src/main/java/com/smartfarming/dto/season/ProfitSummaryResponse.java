package com.smartfarming.dto.season;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfitSummaryResponse {
    private Double totalInvestment;
    private Double totalIncome;
    private Double profit;
    private Double profitMargin;
}
