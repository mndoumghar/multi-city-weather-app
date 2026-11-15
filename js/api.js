const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
import {
  AppError,
  ERROR_CODES,
  createHttpError,
} from "./error-handler.js";


const FORECAST_DAYS = 7;

async function reqJson(url) {
  let response;
  try {
    response  = await fetch(url);
  } catch(error) {
    throw  new AppError(ERROR_CODES.NETWORK, {
      cause: error,
    });
  }

  if(!response.ok) {
    throw createHttpError(response.status);
  }

  
  try {
    return await response.json();
  } catch(error) {
    throw  new AppError(ERROR_CODES.INVALID_RESPONSE, {
      cause: error,
    })
  }
}


const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "weather_code",
  "wind_speed_10m",
  "is_day",
];


const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_probability_max",
  "sunrise",
  "sunset",
];



export async function searchCities(name) {
  const params = new URLSearchParams({
    name,
    count: 5,
    language: "en",
    format: "json",
  });

  const data = await reqJson(
    `${GEOCODING_URL}?${params}`
  );

  return data.results ?? [];
}


export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: CURRENT_FIELDS.join(","),
    daily: DAILY_FIELDS.join(","),
    forecast_days: FORECAST_DAYS,
    timezone: "auto",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
  });

  return reqJson(`${FORECAST_URL}?${params}`);
}

