const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "weather_code",
  "wind_speed_10m",
  "is_day",
];


export async function searchCities(name) {
  const params = new URLSearchParams({
    name,
    count: 5,
    language: "en",
    format: "json",
  });

  const response = await fetch(`${GEOCODING_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Geocoding request failed: ${response.status}`);
  }

  const data = await response.json();
  return data.results ?? [];
}


export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: CURRENT_FIELDS.join(","),
    daily: "sunrise,sunset",
    timezone: "auto",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
  });

  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Forecast request failed: ${response.status}`);
  }

  return response.json();
}
