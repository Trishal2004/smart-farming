package com.smartfarming.service;

import com.smartfarming.dto.weather.WeatherForecastResponse;
import com.smartfarming.entity.Farm;
import com.smartfarming.entity.User;
import com.smartfarming.service.weather.WeatherProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WeatherService {

    private final WeatherProvider weatherProvider;
    private final FarmService farmService;

    public WeatherForecastResponse getGeneralWeather() {
        return weatherProvider.getWeather("General Region");
    }

    public WeatherForecastResponse getWeatherForFarm(Long farmId, User user) {
        Farm farm = farmService.getFarmEntityAndVerifyOwnership(farmId, user);
        String location = farm.getLocation();
        if (location == null || location.isEmpty()) {
            location = "Unknown";
        }
        return weatherProvider.getWeather(location);
    }
}
