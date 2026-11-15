# Multi-City Weather Dashboard

A responsive weather application built with **HTML, CSS and vanilla JavaScript**. Users can search for cities, add multiple locations, and view current weather and a seven-day forecast. Weather data comes from the public **Open-Meteo API**. No backend or API key is required for its free, non-commercial API.

## Features
- Search for a city and display up to five matching locations.
- Add multiple cities without replacing existing cards.
- Display temperature, feels-like temperature, humidity, wind, weather description, sunrise and sunset.
- Display a seven-day forecast with dates, icons, minimum/maximum temperatures and precipitation probability.
- Show loading and readable error messages.
- Prevent duplicate city selections and repeated pending requests.

## Built with
- HTML5 and CSS3 (responsive layout and dark-mode preference).
- JavaScript ES modules, DOM manipulation and Fetch API (`GET`).
- `URLSearchParams` for query parameters.
- Open-Meteo Geocoding API and Forecast API.

## Project structure
```text
js/
  app.js             Application flow and selected-city state
  api.js              API requests and JSON parsing
  error-handler.js    Application errors and HTTP status mapping
  render.js           DOM rendering functions
  dom.js              DOM helper functions
  format.js           Dates, temperatures and unit formatting
  weather-codes.js    Weather descriptions and icons
css/
  style.css           Application styles
index.html            Application entry point
```

## API integration
**Geocoding:** searches for a city and returns location details and coordinates.
```text
GET https://geocoding-api.open-meteo.com/v1/search
```
Parameters: `name`, `count=5`, `language=en`, `format=json`.

**Weather forecast:** retrieves current conditions and daily forecast for selected coordinates.
```text
GET https://api.open-meteo.com/v1/forecast
```
Parameters: `latitude`, `longitude`, `current`, `daily`, `forecast_days=7`, `timezone=auto`, `temperature_unit=celsius`, `wind_speed_unit=kmh`.

Current fields: `temperature_2m`, `apparent_temperature`, `relative_humidity_2m`, `weather_code`, `wind_speed_10m`, `is_day`.

Daily fields: `weather_code`, `temperature_2m_max`, `temperature_2m_min`, `precipitation_probability_max`, `sunrise`, `sunset`.

The application parses the JSON response and passes the location and weather data to rendering functions. Separate modules handle formatting and weather-code descriptions.

## Error handling
`api.js` checks `response.ok`, handles network failures, maps HTTP errors and catches JSON parsing errors. `error-handler.js` defines `AppError` and readable messages. `main.js` displays errors and uses `finally` to hide the loading indicator.

Handled cases: unknown cities, network errors, HTTP 400, 401/403, 429, 5xx, other HTTP errors and invalid JSON.

## Run locally
1. Clone or download the repository and open the folder in VS Code.
2. Start `index.html` with Live Server, or run this command in the project folder:
``` 
Live Server
```
3. Open `http://localhost:8000` in your browser.

An internet connection is required. No build step or package installation is needed for the current project.

## Manual testing
| Test | Result |
|---|---|
| Network error | Tested; application error observed in console |
| HTTP 429 | Tested with a mock response |
| HTTP 500 | Tested with a mock response |
| Invalid JSON | Tested with a mock response |
| Unknown city | Tested; city-not-found error observed |
| Retry and visible UI messages | Complete final browser verification |

## Attribution and API limits
Weather data is provided by [Open-Meteo](https://open-meteo.com/). Location search uses its Geocoding API, based on [GeoNames](https://www.geonames.org/). Add visible attribution in the application.

The free API is intended for non-commercial use. Check the current [pricing and limits](https://open-meteo.com/en/pricing), [terms](https://open-meteo.com/en/terms) and [licence](https://open-meteo.com/en/license) before deployment or commercial use.

## Project links
- GitHub repository: **add repository URL**
- Live demo: **add deployment URL when available**
- Kanban board: **add project board URL**
- Screenshots and complete test log: **add before final delivery**

**Before final delivery:** complete retry/UI tests and validate successful API response structures and missing forecast fields. Do not describe these checks as complete until they have been implemented and tested.
