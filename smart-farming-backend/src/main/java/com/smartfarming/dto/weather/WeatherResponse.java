package com.smartfarming.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {
    private Long id;
    private Long seasonId;
    private LocalDate recordDate;
    private Double temperature;
    private Double humidity;
    private Double rainfallMm;
    private String advisoryNotes;
}
