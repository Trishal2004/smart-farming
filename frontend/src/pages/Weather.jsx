import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { 
  CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, 
  AlertTriangle, Info, CheckCircle2, ShieldAlert, MapPin
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { weatherService } from '../services/weatherService';

export default function Weather() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await weatherService.getWeather(); // Calling GET /api/weather
      if (res) {
        setWeatherData(res);
      } else {
        throw new Error('Failed to fetch weather');
      }
    } catch (err) {
      setError('Could not load weather data. Please check your connection.');
      toast.error('Failed to load weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (condition, className = "w-6 h-6") => {
    if (!condition) return <CloudSun className={`${className} text-blue-400`} />;
    switch (condition.toLowerCase()) {
      case 'sunny': return <Sun className={`${className} text-amber-500`} />;
      case 'rain': 
      case 'rainy': return <CloudRain className={`${className} text-blue-500`} />;
      case 'cloudy': return <Cloud className={`${className} text-slate-500`} />;
      default: return <CloudSun className={`${className} text-blue-400`} />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Weather Advisory" subtitle="Loading latest meteorological data..." />
        <div className="flex justify-center p-20">
          <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Weather Advisory" subtitle="Track real-time micro-climate data for your farm." />
        <Card className="flex flex-col items-center justify-center p-12 text-center border-red-200 bg-red-50">
          <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <Button onClick={fetchWeather} variant="outline">Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <PageHeader 
        title="Weather Advisory" 
        subtitle="Track real-time micro-climate data and agronomic recommendations for your farm."
        action={
          <Button onClick={fetchWeather} variant="outline" icon={CloudSun}>
            Refresh Data
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Current & Forecast */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Current Weather Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl relative overflow-hidden">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-slate-300 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-400" /> Current Conditions (General)
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/10">
                    {getWeatherIcon(weatherData.condition, "w-16 h-16 text-white")}
                  </div>
                  <div>
                    <div className="text-6xl font-black tracking-tighter">{weatherData.temperature}°<span className="text-4xl text-slate-400 font-bold">C</span></div>
                    <div className="text-xl font-medium text-slate-300 mt-1">{weatherData.condition}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5 mb-1"><Droplets className="w-4 h-4 text-blue-400" /> Humidity</span>
                  <span className="text-xl font-bold">{weatherData.humidity}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5 mb-1"><CloudRain className="w-4 h-4 text-blue-400" /> Rainfall</span>
                  <span className="text-xl font-bold">{weatherData.rainfall} mm</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-sm flex items-center gap-1.5 mb-1"><Wind className="w-4 h-4 text-blue-400" /> Wind</span>
                  <span className="text-xl font-bold">{weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 5-Day Forecast */}
          <Card>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Forecast</h3>
            <div className="flex flex-col gap-3">
              {(weatherData.forecast || []).map((f, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <CloudSun className="w-6 h-6 text-slate-500" />
                  <span className="text-slate-700 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Advisories */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 mb-2 px-1">Agronomic Advisories</h3>
          
          {(weatherData.advisories || []).map((advisory, idx) => {
            return (
              <div key={idx} className={`bg-blue-50 border border-blue-200 rounded-xl p-4 transition-transform hover:-translate-y-1 duration-200 shadow-sm`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 text-blue-500`}>
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm text-blue-800 mb-1`}>Advisory</h4>
                    <p className={`text-sm text-blue-800 opacity-90 leading-relaxed`}>{advisory}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
