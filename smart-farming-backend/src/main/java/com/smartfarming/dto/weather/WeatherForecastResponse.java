package com.smartfarming.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherForecastResponse {
    private Double temperature;
    private Double humidity;
    private Double rainfall;
    private Double windSpeed;
    private String condition;
    private List<String> forecast;
    private List<String> advisories;
}
