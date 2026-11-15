export function formatPlaceName(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(", ");
}


export function formatTime(isoDateTime) {
  return isoDateTime?.split("T")[1]?.slice(0, 5) ?? "—";
}

export function formatTemperature(celsius) {
  return `${Math.round(celsius)}°C`;
}


export function formatPercentage(value) {
  return `${value}%`;
}

export function formatWindSpeed(kmh) {
  return `${kmh} km/h`;
}


export function formatForecastDate(dateString) {
  
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
    }).format(date);
}
