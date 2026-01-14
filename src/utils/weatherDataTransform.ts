import type {
  OpenWeatherCallResponse,
  HourlyForecastType,
  DailyForecastType,
} from "./types";
import {
  convertToLocalTimestamp,
  convertTimestampToLocalDateString,
} from "./datetimeTransform";

/**
 * Transforms hourly weather data from API response to app format (HourlyForecastType)
 * Filters out past hours, and leaves only the next 24 hours forecasts
 * Extracts iconName and description
 * Converts timestamps from UTC to local time at the end
 */
export function transformHourlyData(
  forecastResponse: OpenWeatherCallResponse
): HourlyForecastType[] {
  const timezoneOffset = forecastResponse.city.timezone;

  // Get current UTC timestamp in seconds
  const currentUtcTimestamp = Math.floor(Date.now() / 1000);

  // Calculate timestamp for 24 hours from now (in seconds)
  const HOURS_24_IN_SECONDS = 24 * 60 * 60; // 86400 seconds
  const next24HoursTimestamp = currentUtcTimestamp + HOURS_24_IN_SECONDS;

  return forecastResponse.list
    .filter((item) => {
      // Filter items that are:
      // 1. Future (greater than current timestamp)
      // 2. Within the next 24 hours (less than or equal to current + 24 hours)
      // Both timestamps are in seconds (UTC)
      const isFuture = item.dt > currentUtcTimestamp;
      const isWithin24Hours = item.dt <= next24HoursTimestamp;

      return isFuture && isWithin24Hours;
    })
    .map((item) => {
      // Convert UTC timestamps to local time only at the end
      const localTime = convertToLocalTimestamp(item.dt, timezoneOffset);
      const localTimeString = convertTimestampToLocalDateString(
        item.dt,
        timezoneOffset
      );

      return {
        time: localTime,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        iconName: item.weather[0].icon,
        description: item.weather[0].description,
        timeString: localTimeString,
      };
    });
}

/**
 * Transforms daily weather data from API response to app format (DailyForecastType)
 * Groups items by day and selects the forecast closest to 12pm (noon) local time for each day
 * Converts timestamps from UTC to local time
 */
export function transformDailyData(
  forecastResponse: OpenWeatherCallResponse
): DailyForecastType[] {
  // Use timezone from city object in the response (UTC offset in seconds)
  const timezoneOffset = forecastResponse.city.timezone;

  // Group items by date (local time). itemsByDate will be something like this:
  /*{
    "2024-01-15" => [item1, item2, item3],
    "2024-01-16" => [item4, item5]
  }*/
  const itemsByDate = new Map<string, typeof forecastResponse.list>();

  forecastResponse.list.forEach((item) => {
    const localDateString = convertTimestampToLocalDateString(
      item.dt,
      timezoneOffset
    ).split(" ")[0]; // Extract only date part (YYYY-MM-DD)

    if (!itemsByDate.has(localDateString)) {
      itemsByDate.set(localDateString, []);
    }
    itemsByDate.get(localDateString)!.push(item);
  });

  // For each day, find the item closest to 12pm (noon) local time
  // Store both the closest item and all items for the day
  const dailyData: Array<{
    closestToNoon: (typeof forecastResponse.list)[0];
    allItems: typeof forecastResponse.list;
    dateString: string;
  }> = [];

  itemsByDate.forEach((items, dateString) => {
    let closestToNoon = items[0];
    let minDistanceFromNoon = Infinity;

    items.forEach((item) => {
      // Get local time string for this item
      const localTimeString = convertTimestampToLocalDateString(
        item.dt,
        timezoneOffset
      );
      // Extract hour and minutes from "YYYY-MM-DD HH:MM:SS"
      const timePart = localTimeString.split(" ")[1]; // "HH:MM:SS"
      const [hours, minutes] = timePart.split(":").map(Number);

      // Calculate distance from 12:00:00 in minutes
      const totalMinutes = hours * 60 + minutes;
      const noonMinutes = 12 * 60; // 12:00 = 720 minutes
      const distance = Math.abs(totalMinutes - noonMinutes);

      if (distance < minDistanceFromNoon) {
        minDistanceFromNoon = distance;
        closestToNoon = item;
      }
    });

    dailyData.push({
      closestToNoon,
      allItems: items,
      dateString,
    });
  });

  // Sort by date to ensure chronological order
  dailyData.sort((a, b) => a.closestToNoon.dt - b.closestToNoon.dt);

  // Transform selected items to DailyForecastType
  return dailyData.map(({ closestToNoon, allItems, dateString }) => {
    const localTime = convertToLocalTimestamp(closestToNoon.dt, timezoneOffset);

    // Calculate min and max temperatures from all items of the day
    const minTemperature = Math.min(
      ...allItems.map((item) => item.main.temp_min)
    );
    const maxTemperature = Math.max(
      ...allItems.map((item) => item.main.temp_max)
    );

    return {
      time: localTime,
      dateString: dateString,
      summary: closestToNoon.weather[0].description,
      minTemperature: minTemperature,
      maxTemperature: maxTemperature,
      iconName: closestToNoon.weather[0].icon,
      description: closestToNoon.weather[0].description,
    };
  });
}
