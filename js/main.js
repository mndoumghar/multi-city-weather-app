
const URL = "https://geocoding-api.open-meteo.com/v1/search";
const METEO_URL = "https://api.open-meteo.com/v1/forecast";


const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const errorMessage = document.getElementById("error");
const results = document.getElementById("results");
const loading = document.getElementById("loading");
const dashboard = document.getElementById("main");

const currentCard = document.getElementById("current");
const currentHeading = currentCard.querySelector(".place");
const currentIcon = currentCard.querySelector(".current-icon");
const currentTemp = currentCard.querySelector(".current-temp");
const currentLabel = currentCard.querySelector(".current-label");

const feels = currentCard.querySelector('[data-field="feels"]');
const humidity = currentCard.querySelector('[data-field="humidity"]');
const wind = currentCard.querySelector('[data-field="wind"]');
const sunrise = currentCard.querySelector('[data-field="sunrise"]');
const sunset = currentCard.querySelector('[data-field="sunset"]');

const WMO_CODES = {
    0: ["Clear sky", "☀️", "🌙"],
    1: ["Mainly clear", "🌤️", "🌙"],
    2: ["Partly cloudy", "⛅", "☁️"],
    3: ["Overcast", "☁️", "☁️"],
    45: ["Fog", "🌫️", "🌫️"],
    48: ["Depositing rime fog", "🌫️", "🌫️"],
    51: ["Light drizzle", "🌦️", "🌧️"],
    53: ["Drizzle", "🌦️", "🌧️"],
    55: ["Dense drizzle", "🌧️", "🌧️"],
    56: ["Freezing drizzle", "🌧️", "🌧️"],
    57: ["Dense freezing drizzle", "🌧️", "🌧️"],
    61: ["Light rain", "🌦️", "🌧️"],
    63: ["Rain", "🌧️", "🌧️"],
    65: ["Heavy rain", "🌧️", "🌧️"],
    66: ["Freezing rain", "🌧️", "🌧️"],
    67: ["Heavy freezing rain", "🌧️", "🌧️"],
    71: ["Light snow", "🌨️", "🌨️"],
    73: ["Snow", "🌨️", "🌨️"],
    75: ["Heavy snow", "❄️", "❄️"],
    77: ["Snow grains", "🌨️", "🌨️"],
    80: ["Light showers", "🌦️", "🌧️"],
    81: ["Showers", "🌧️", "🌧️"],
    82: ["Violent showers", "⛈️", "⛈️"],
    85: ["Snow showers", "🌨️", "🌨️"],
    86: ["Heavy snow showers", "❄️", "❄️"],
    95: ["Thunderstorm", "⛈️", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️", "⛈️"],
    99: ["Severe thunderstorm with hail", "⛈️", "⛈️"]
};



function show(element) {
    element.hidden = false;
    element.classList.remove("hidden");
}

function hide(element) {
    element.hidden = true;
    element.classList.add("hidden");
}


async function fetchData(city) {
    const params = new URLSearchParams({
        name: city,
        count: 5,
        language: "en",
        format: "json"
    });

    const response = await fetch(`${URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    return data?.results ?? [];
}


async function fetchWeather(latitude, longitude) {

    const params = new URLSearchParams({
        latitude,
        longitude,

        current: [
            "temperature_2m",
            "apparent_temperature",
            "relative_humidity_2m",
            "weather_code",
            "wind_speed_10m",
            "is_day"
        ].join(","),

        daily: "sunrise,sunset",
        timezone: "auto",
        temperature_unit: "celsius",
        wind_speed_unit: "kmh"
    });

    const response = await fetch(`${METEO_URL}?${params}`);

    if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
}


function describeWeather(code, isDay = true) {
    const [label, dayIcon, nightIcon] =
        WMO_CODES[code] ?? ["Unknown", "❔", "❔"];
    return {
        label,
        icon: isDay ? dayIcon : nightIcon
    };
}

function formatTime(value) {
    return value.split("T")[1]?.slice(0, 5);
}

function renderCities(places) {
    results.replaceChildren();
    const find = new Set();
    places.forEach(place => {
        if (find.has(place.id)) return;
        const button = document.createElement("button");
        button.classList.add("btn");
        button.type = "button";
        button.textContent = [
            place.name,
            place.admin1,
            place.country
        ].filter(Boolean).join(", ");

        button.classList.add(
            "w-full",
            "text-left",
            "border",
            "rounded",
            "p-3",
            "hover:bg-gray-100"
        );

        button.addEventListener("click", () => {
            selectCity(place);
        })

        results.append(button);
        find.add(place.id);
    });
}



async function selectCity(place) {
    show(loading);

    loading.textContent = "Loading weather...";
    hide(errorMessage);
    dashboard.setAttribute("aria-busy", "true");

    try {
        const weather = await fetchWeather(
            place.latitude,
            place.longitude
        );

        renderCurrentWeather(place, weather);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to load weather. Please try again.";

        show(errorMessage);

    } finally {

        hide(loading);

        dashboard.setAttribute("aria-busy", "false");
    }
}


// user_stories-02 ============= ::: 
function renderCurrentWeather(place, data) {

    const current = data.current;
    const daily = data.daily;

    const condition = describeWeather(
        current.weather_code,
        Boolean(current.is_day)
    );

    currentHeading.textContent = [
        place.name,
        place.admin1,
        place.country
    ].filter(Boolean).join(", ");

    currentIcon.textContent = condition.icon;

    currentTemp.textContent = `${Math.round(current.temperature_2m)}°C`
    currentLabel.textContent = condition.label

    feels.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    wind.textContent =`${current.wind_speed_10m} km/h`;
    sunrise.textContent =formatTime(daily?.sunrise?.[0]);
    sunset.textContent = formatTime(daily?.sunset?.[0]);
    show(currentCard);


}

searchForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value.trim();
    hide(errorMessage);
    results.replaceChildren();
    hide(currentCard);
    if (!isValid(city)) {
        errorMessage.textContent = "Please enter a city name.";
        show(errorMessage);
        return;
    }

    show(loading);

    loading.textContent = "Searching...";

    dashboard.setAttribute("aria-busy", "true");
    try {
        const places = await fetchData(city);

        if (places.length === 0) {
            errorMessage.textContent = "City not found.";
            show(errorMessage);
            return;
        }

        renderCities(places);

    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to search. Please try again.";

        show(errorMessage);

    } finally {
        hide(loading);
        dashboard.setAttribute("aria-busy", "false");
    }
});


function isValid(city) {
    return city.trim().length > 0;
}
