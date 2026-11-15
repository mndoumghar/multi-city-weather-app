import { show, hide } from "./dom.js";
import { searchCities, getWeather } from "./api.js";

import {
  renderLayout,
  renderResults,
  renderCityWeatherCard,
} from "./render.js";


import {
    AppError,
    getErrorMessage,
    ERROR_CODES,
  } from "./error-handler.js";


const root = document.getElementById("app");

const ui = renderLayout(root);

const selectedCities = new Map();
const pendingCities = new Set();


init();

function init() {
  ui.searchForm.addEventListener("submit", handleSearchSubmit);
}

async function handleSearchSubmit(event) {
  event.preventDefault();

  const city = ui.cityInput.value.trim();
  resetMessages();

  if (!city) {
    showError("Please enter a city name... ");
    return;
  }


  await runTask("Searching...", async () => {
    const places = await searchCities(city);

    if (places.length === 0) {
      throw new AppError(ERROR_CODES.CITY_NOT_FOUND);

    }

    renderResults(ui.resultsList, places, selectCity);
    show(ui.resultsSection);

  });
}

async function selectCity(place) {

  const cityKey = place.id ?? `${place.latitude},${place.longitude}`;
  if (selectedCities.has(cityKey)) {
    showError("This city is already on your dashboard.");
    return;
  }

  if (pendingCities.has(cityKey)) {
    return;
  }

  pendingCities.add(cityKey);

  try {
    await runTask("Loading weather...", async () => {
      const weather = await getWeather(
        place.latitude,
        place.longitude
      );

      const cityCard = renderCityWeatherCard(place, weather);

      ui.citiesContainer.prepend(cityCard);

      selectedCities.set(cityKey, {
        place,
        weather,
      });

      show(ui.citiesContainer);
      hide(ui.resultsSection);

    });

  } finally {
    pendingCities.delete(cityKey);
  }
}



async function runTask(loadingText, task) {
  hide(ui.errorMessage);

  ui.statusMessage.textContent = loadingText;
  show(ui.statusMessage);

  ui.main.setAttribute("aria-busy", "true");

  try {
    await task();
  } catch (error) {
    console.error(error);
    showError(getErrorMessage(error));
  } finally {
    hide(ui.statusMessage);
    ui.main.setAttribute("aria-busy", "false");
  }
}


function showError(text) {
  ui.errorMessage.textContent = text;
  show(ui.errorMessage);
}


function resetMessages() {
  hide(ui.errorMessage);
  hide(ui.resultsSection);
  ui.resultsList.replaceChildren();
}