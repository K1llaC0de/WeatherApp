require('dotenv').config({ path: './weather.env' });

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Access the environment variable
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT;

app.use(cors());

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${WEATHER_API_KEY}`;
    const weatherResponse = await axios.get(weatherUrl);
    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
