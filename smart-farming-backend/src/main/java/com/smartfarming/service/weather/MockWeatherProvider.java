package com.smartfarming.service.weather;

import com.smartfarming.dto.weather.WeatherForecastResponse;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class MockWeatherProvider implements WeatherProvider {
    
    @Override
    public WeatherForecastResponse getWeather(String location) {
        // Return standard mock data
        return WeatherForecastResponse.builder()
                .temperature(28.5)
                .humidity(65.0)
                .rainfall(12.0)
                .windSpeed(15.5)
                .condition("Partly Cloudy")
                .forecast(Arrays.asList(
                        "Today: Partly Cloudy, 28°C",
                        "Tomorrow: Showers expected, 26°C",
                        "Day 3: Clear skies, 30°C"
                ))
                .advisories(Arrays.asList(
                        "Favorable conditions for pesticide application today.",
                        "Prepare for rain tomorrow; delay irrigation."
                ))
                .build();
    }
}
