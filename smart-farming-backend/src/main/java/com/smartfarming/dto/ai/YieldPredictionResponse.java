package com.smartfarming.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class YieldPredictionResponse {
    private Double predictedYield;
    private Double yieldPerAcre;
    private String confidenceMessage;
}
