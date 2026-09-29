package com.smartfarming.dto.harvest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HarvestResponse {
    private Long id;
    private Long seasonId;
    private LocalDate harvestDate;
    private Double quantity;
    private Double sellingPricePerKg;
    private String buyerName;
    private Double totalIncome;
    private LocalDateTime createdAt;
}
