import { h, setChildren } from "./dom.js";
import { describeWeatherCode } from "./weather-codes.js";
import {
  formatPlaceName,
  formatTime,
  formatTemperature,
  formatPercentage,
  formatWindSpeed,
  formatForecastDate,

} from "./format.js";



export function renderLayout(root) {
  // creat input ....
  const cityInput = h("input", {
    type: "search",
    id: "city",
    name: "city",
    placeholder: "Enter city name...",
    autocomplete: "off",
    required: true,
  });

  // creat form <form> ...

  const searchForm = h("form", { className: "search", role: "search", autocomplete: "off" }, [

    h("label", { className: "visually-hidden", for: "city", text: "Search for a city" }),
    cityInput,
    h("button", { type: "submit", text: "Search" }),
  ]);

  const header = h("header", { className: "app-header" }, [
    h("h1", { className: "brand", text: "⛅ Weather Dashboard" }),
    searchForm,
  ]);

  const statusMessage = h("p", {
    className: "message",
    role: "status",
    "aria-live": "polite",
    hidden: true,
  });

  const errorMessage = h("p", {
    className: "message is-error",
    role: "alert",
    hidden: true,
  });


  const resultsList = h("div", { className: "results", "aria-live": "polite" });



  const resultsSection = h("section", { className: "card", "aria-label": "City search results" }, [
    h("h2", { text: "Search results" }),
    resultsList,
  ]);

  const currentCard = h("section", {
    className: "card current",
    "aria-label": "Current weather",
    hidden: true,
  });

  //forcast ====>
  const forecastList = h("div", {
    className: "forecast-list",
  });

  const forecastSection = h("section", {
    className: "card forecast",
    "aria-label": "7-day weather forecast",
    hidden: true,
  }, [
    h("h2", { text: "7-Day Forecast" }),
    forecastList,
  ]);
  ///////////////


  const main = h(
    "main",
    { id: "main", className: "dashboard", "aria-busy": "false" },
    [statusMessage, errorMessage, resultsSection, currentCard, forecastSection]
  )


  setChildren(root, [header, main]);
  return {
  cityInput,
  searchForm,
  statusMessage,
  errorMessage,
  resultsList,
  resultsSection,
  currentCard,
  forecastList,
  forecastSection,
  main,
};

}


export function renderResults(container, places, onSelect) {
  const seen = new Set();
  const buttons = places
    .filter((place) => {
      if (seen.has(place.id)) return false;
      seen.add(place.id);
      return true;
    })


    .map((place) =>
      h(
        "button",
        {
          type: "button",
          className: "result-button",
          onClick: () => onSelect(place),
        },

        formatPlaceName(place)
      )
    );
  setChildren(container, buttons);
}

export function renderCurrentWeather(container, place, weatherData) {
  const current = weatherData.current;
  const daily = weatherData.daily;
  const condition = describeWeatherCode(current.weather_code, Boolean(current.is_day));

  const detail = (label, value) =>
    h("div", {}, [h("dt", { text: label }), h("dd", { text: value })]);

  const content = [
    h("h2", { className: "place", text: formatPlaceName(place) }),
    h("div", { className: "current-main" }, [
      h("span", { className: "current-icon", "aria-hidden": "true", text: condition.icon }),
      h("p", { className: "current-temp", text: formatTemperature(current.temperature_2m) }),
    ]),
    h("p", { className: "current-label", text: condition.label }),
    h("dl", { className: "current-details" }, [
      detail("Feels like", formatTemperature(current.apparent_temperature)),
      detail("Humidity", formatPercentage(current.relative_humidity_2m)),
      detail("Wind", formatWindSpeed(current.wind_speed_10m)),
      detail("Sunrise", formatTime(daily?.sunrise?.[0])),
      detail("Sunset", formatTime(daily?.sunset?.[0])),
    ]),
  ];

  setChildren(container, content);
}



export function renderDailyForecast(container, weatherData) {
  const daily = weatherData.daily;

  const forecast = daily.time.map((date, index) => ({
    date: formatForecastDate(date),
    maxTemp: formatTemperature(daily.temperature_2m_max[index]),
    minTemp: formatTemperature(daily.temperature_2m_min[index]),
    weatherCode: daily.weather_code[index],
    precipitation: formatPercentage(
      daily.precipitation_probability_max[index] ?? 0
    ),
  }));

  const cards = forecast.map((day) => {
    const condition = describeWeatherCode(day.weatherCode, true);

    return h("article", { className: "forecast-card" }, [
      h("h3", {
        className: "forecast-date",
        text: day.date,
      }),

      h("span", {
        className: "forecast-icon",
        "aria-hidden": "true",
        text: condition.icon,
      }),

      h("p", {
        className: "forecast-condition",
        text: condition.label,
      }),

      h("div", { className: "forecast-temperatures" }, [
        h("span", {
          className: "forecast-max",
          text: day.maxTemp,
        }),
        h("span", {
          className: "forecast-min",
          text: day.minTemp,
        }),
      ]),

      h("p", {
        className: "forecast-precipitation",
        text: `Rain: ${day.precipitation}`,
      }),
    ]);
  });

  setChildren(container, cards);
}
