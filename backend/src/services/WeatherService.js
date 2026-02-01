/**
 * FILE: backend/src/services/WeatherService.js
 * 
 * PURPOSE: Service for fetching weather data
 * 
 * RESPONSIBILITIES:
 *  - Fetch current weather and forecast from OpenMeteo API
 *  - Provide crop-specific directives based on weather
 *  - Handle geocoding (mocked or simple mapping for now)
 */

const axios = require('axios');

class WeatherService {
  constructor() {
    this.baseUrl = 'https://api.open-meteo.com/v1/forecast';
    // Simple mock geocoding map for demo locations
    this.locationMap = {
      'Pune': { lat: 18.5204, lon: 73.8567 },
      'Mumbai': { lat: 19.0760, lon: 72.8777 },
      'Delhi': { lat: 28.6139, lon: 77.2090 },
      'Bangalore': { lat: 12.9716, lon: 77.5946 },
      'Hyderabad': { lat: 17.3850, lon: 78.4867 },
      'Chennai': { lat: 13.0827, lon: 80.2707 },
      'Ahmedabad': { lat: 23.0225, lon: 72.5714 },
      'Ludhiana': { lat: 30.9010, lon: 75.8573 }
    };
  }

  /**
   * Get coordinates for a location string
   */
  getCoordinates(location) {
    // Default to Pune if not found
    const coords = this.locationMap[location] || this.locationMap['Pune'];
    return coords;
  }

  /**
   * Get current weather
   */
  async getCurrentWeather(location) {
    try {
      const { lat, lon } = this.getCoordinates(location);
      const response = await axios.get(this.baseUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          timezone: 'Asia/Kolkata'
        }
      });
      
      return response.data.current_weather;
    } catch (error) {
      console.error('Error fetching weather:', error);
      throw new Error('Failed to fetch weather data');
    }
  }

  /**
   * Get 7-day forecast
   */
  async getForecast(location) {
    try {
      const { lat, lon } = this.getCoordinates(location);
      const response = await axios.get(this.baseUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
          timezone: 'Asia/Kolkata'
        }
      });
      
      return response.data.daily;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      throw new Error('Failed to fetch forecast data');
    }
  }

  /**
   * Get advisory based on crop and weather
   */
  async getAdvisory(location, crop) {
    try {
      const weather = await this.getCurrentWeather(location);
      const forecast = await this.getForecast(location);
      
      // Simple logic for advisory
      let advisory = `Conditions are favorable for ${crop}.`;
      
      // Check for rain
      const rainToday = forecast.precipitation_sum[0] > 0;
      const rainTomorrow = forecast.precipitation_sum[1] > 0;
      
      if (rainToday || rainTomorrow) {
        advisory = `Expect rain shortly. Delay irrigation and pesticide application for ${crop}.`;
      } else if (weather.temperature > 35) {
        advisory = `High temperatures detected. Ensure adequate irrigation for ${crop} to prevent heat stress.`;
      }
      
      return {
        crop,
        location,
        advisory,
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Error generating advisory:', error);
      throw new Error('Failed to generate advisory');
    }
  }
}

module.exports = new WeatherService();
