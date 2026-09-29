package com.smartfarming.dto.soil;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoilReportResponse {
    private Long id;
    private Long seasonId;
    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private Double phLevel;
    private Double temperature;
    private Double humidity;
    private Double rainfall;
    private LocalDateTime createdAt;
}
