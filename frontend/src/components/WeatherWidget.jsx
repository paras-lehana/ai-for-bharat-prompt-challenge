import React, { useState, useEffect } from 'react';
import { weatherAPI } from '../utils/api';
import { WiDaySunny, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiFog } from 'react-icons/wi';
import { FiMapPin } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const WeatherWidget = ({ location = 'Pune' }) => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchWeather();
    }, [location]);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            const [currentRes, forecastRes] = await Promise.all([
                weatherAPI.getCurrent(location),
                weatherAPI.getForecast(location)
            ]);
            setWeather(currentRes.data);
            setForecast(forecastRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching weather:', err);
            // Don't show error to user in widget, just fallback or hide
            setError('Unavailable');
            setLoading(false);
        }
    };

    const getWeatherIcon = (code) => {
        // WMO Weather interpretation codes (WW)
        if (code === 0) return <WiDaySunny className="text-yellow-500 w-12 h-12" />;
        if (code >= 1 && code <= 3) return <WiCloudy className="text-gray-400 w-12 h-12" />;
        if (code >= 51 && code <= 67) return <WiRain className="text-blue-400 w-12 h-12" />;
        if (code >= 80 && code <= 82) return <WiRain className="text-blue-600 w-12 h-12" />;
        if (code >= 95) return <WiThunderstorm className="text-purple-600 w-12 h-12" />;
        if (code >= 71 && code <= 77) return <WiSnow className="text-blue-200 w-12 h-12" />;
        if (code >= 45 && code <= 48) return <WiFog className="text-gray-300 w-12 h-12" />;
        return <WiDaySunny className="text-yellow-500 w-12 h-12" />;
    };

    if (loading) return <div className="h-48 flex items-center justify-center"><LoadingSpinner /></div>;
    if (error || !weather) return null;

    return (
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl p-6 text-white shadow-lg animate-fade-in relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 text-white opacity-10">
                <WiDaySunny size={200} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiMapPin />
                            <h3 className="font-semibold text-lg">{location}</h3>
                        </div>
                        <p className="text-blue-100 text-sm">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-bold">{Math.round(weather.temperature)}°</span>
                            {getWeatherIcon(weather.weathercode)}
                        </div>
                        <p className="text-blue-100 text-sm">Wind: {weather.windspeed} km/h</p>
                    </div>
                </div>

                {/* Forecast */}
                {forecast && (
                    <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/20">
                        {forecast.time.slice(1, 5).map((date, idx) => (
                            <div key={date} className="text-center">
                                <p className="text-xs text-blue-100 mb-1">
                                    {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
                                </p>
                                <div className="flex justify-center my-1 scale-75">
                                    {getWeatherIcon(forecast.weathercode[idx + 1])}
                                </div>
                                <p className="font-semibold text-sm">
                                    {Math.round(forecast.temperature_2m_max[idx + 1])}°
                                    <span className="text-xs text-blue-200 ml-1">
                                        {Math.round(forecast.temperature_2m_min[idx + 1])}°
                                    </span>
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherWidget;
