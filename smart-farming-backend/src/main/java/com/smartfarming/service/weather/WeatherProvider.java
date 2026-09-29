package com.smartfarming.service.weather;

import com.smartfarming.dto.weather.WeatherForecastResponse;

public interface WeatherProvider {
    WeatherForecastResponse getWeather(String location);
}
