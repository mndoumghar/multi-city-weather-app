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

