/* Internal types definitions */

export type LocationType = {
  lat: number;
  lon: number;
  name: string;
};

export type HourlyForecastType = {
  time: number; // Unix timestamp (local time)
  temperature: number;
  humidity: number;
  iconName: string; // Weather icon id (e.g., "01d")
  description: string; // Weather description
  timeString: string; // Local date string (YYYY-MM-DD HH:MM:SS) for easy display
};

export type DailyForecastType = {
  time: number; // Unix timestamp (local time) - represents the day
  dateString: string; // Local date string (YYYY-MM-DD) for easy display
  summary: string;
  minTemperature: number;
  maxTemperature: number;
  iconName: string; // Weather icon id (e.g., "01d")
  description: string; // Weather description
};

/* OpenWeather API types definitions */

export type OpenWeatherCondition = {
  id: number; // Weather condition id
  main: string; // Group of weather parameters (Rain, Snow, etc.)
  description: string; // Weather condition
  icon: string; // Weather icon id.
};

export type OpenWeatherForecastItem = {
  dt: number; // Unix, UTC timestamp
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: OpenWeatherCondition[];
  dt_txt: string; // UTC date string (YYYY-MM-DD HH:MM:SS) for easy display
};

export type OpenWeatherCallResponse = {
  list: OpenWeatherForecastItem[];
  city: {
    timezone: number; // Shift in seconds from UTC
  };
};
