import { show, hide } from "./dom.js";
import { searchCities, getWeather } from "./api.js";
import { renderLayout, renderResults, renderCurrentWeather } from "./render.js";


const root = document.getElementById("app");
const ui = renderLayout(root);

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
      showError("City not found.");
      return;
    }

    renderResults(ui.resultsList, places, selectCity);
  }, "Unable to search. Please try again.");
}

async function selectCity(place) {
  hide(ui.currentCard);

  await runTask("Loading weather...", async () => {
    const weather = await getWeather(place.latitude, place.longitude);
    renderCurrentWeather(ui.currentCard, place, weather);
    show(ui.currentCard);
  }, "Unable to load weather. Please try again.");
}


async function runTask(loadingText, task, errorText) {
  hide(ui.errorMessage);
  ui.statusMessage.textContent = loadingText;
  show(ui.statusMessage);
  ui.main.setAttribute("aria-busy", "true");

  try {
    await task();
  } catch (error) {
    console.error(error);
    showError(errorText);
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
  hide(ui.currentCard);
  ui.resultsList.replaceChildren();
}
