import { type OpenWeatherCallResponse } from "./types";

const FORECAST_API_BASE_URL =
  "https://api.openweathermap.org/data/2.5/forecast";
const UNITS = "metric";

/**
 * Fetches weather data from OpenWeather Forecast API 2.5
 * @param lat - Latitude of the location
 * @param lon - Longitude of the location
 * @returns Promise with the weather data response
 * @throws Error if API key is missing or API request fails
 */
export async function fetchForecastWeatherData(
  lat: number,
  lon: number
): Promise<OpenWeatherCallResponse> {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API_KEY is missing. Please set VITE_API_KEY in your .env file."
    );
  }

  const url = new URL(FORECAST_API_BASE_URL);
  url.searchParams.append("lat", lat.toString());
  url.searchParams.append("lon", lon.toString());
  url.searchParams.append("units", UNITS);
  url.searchParams.append("appid", apiKey);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Weather API error: ${response.status} ${response.statusText}. ${
          errorData.message || ""
        }`
      );
    }

    const data: OpenWeatherCallResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch weather data");
  }
}
