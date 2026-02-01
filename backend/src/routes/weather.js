const express = require('express');
const router = express.Router();
const WeatherService = require('../services/WeatherService');

// Get current weather
router.get('/current/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const weather = await WeatherService.getCurrentWeather(location);
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get forecast
router.get('/forecast/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const forecast = await WeatherService.getForecast(location);
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get advisory
router.get('/advisory/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { crop } = req.query;
    if (!crop) {
      return res.status(400).json({ error: 'Crop parameter is required' });
    }
    const advisory = await WeatherService.getAdvisory(location, crop);
    res.json(advisory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
