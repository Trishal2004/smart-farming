package com.smartfarming.controller;

import com.smartfarming.dto.weather.WeatherForecastResponse;
import com.smartfarming.entity.User;
import com.smartfarming.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/weather")
    public ResponseEntity<WeatherForecastResponse> getGeneralWeather() {
        return ResponseEntity.ok(weatherService.getGeneralWeather());
    }

    @GetMapping("/farms/{farmId}/weather")
    public ResponseEntity<WeatherForecastResponse> getWeatherForFarm(
            @PathVariable Long farmId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(weatherService.getWeatherForFarm(farmId, user));
    }
}
