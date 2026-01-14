import Header from "./components/Commons/Header";
import type {
  LocationType,
  HourlyForecastType,
  DailyForecastType,
} from "./utils/types";
import TabMenu from "./components/Commons/TabMenu";
import NextHoursForecastPanel from "./components/HourlyForecast/NextHoursForecastPanel";
import { useEffect, useState } from "react";
import { fetchForecastWeatherData } from "./utils/api";
import {
  transformDailyData,
  transformHourlyData,
} from "./utils/weatherDataTransform";
import FiveDaysForecastPanel from "./components/DailyForecast/FiveDaysForecastPanel";
import Footer from "./components/Commons/Footer";
import { searchCityByName } from "./utils/citySearch";

const initialLocations: LocationType[] = [
  { name: "Rio de Janeiro", lat: -22.9068, lon: -43.1729 },
  { name: "Beijing", lat: 39.9042, lon: 116.4074 },
  { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
];

function App() {
  const [selectedCityIndex, setSelectedCityIndex] = useState<number>(0);
  //searchedCity is the city that the user searched using the search bar
  const [searchedCity, setSearchedCity] = useState<LocationType | null>(null);
  const [hourlyForecastList, setHourlyForecastList] = useState<
    HourlyForecastType[]
  >([]);
  const [dailyForecastList, setDailyForecastList] = useState<
    DailyForecastType[]
  >([]);
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeatherData = async (location: LocationType) => {
    setIsLoading(true);
    setError(null);
    try {
      const forecastResponse = await fetchForecastWeatherData(
        location.lat,
        location.lon
      );

      //Transform api response to app format
      const hourlyForecastList = transformHourlyData(forecastResponse);
      const dailyForecastList = transformDailyData(forecastResponse);

      setHourlyForecastList(hourlyForecastList);
      setDailyForecastList(dailyForecastList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load weather data"
      );
    } finally {
      setIsLoading(false);
      setLastUpdatedTimestamp(Math.floor(Date.now() / 1000));
    }
  };

  useEffect(() => {
    if (selectedCityIndex >= 0 && selectedCityIndex < initialLocations.length) {
      //selectedCityIndex is the index of a city in the initialLocations array
      setSearchedCity(null);
      loadWeatherData(initialLocations[selectedCityIndex]);
    }
  }, [selectedCityIndex]);

  useEffect(() => {
    if (searchedCity) {
      loadWeatherData(searchedCity);
    }
  }, [searchedCity]);

  const handleSearch = async (searchTerm: string) => {
    setSelectedCityIndex(-1);
    setError(null);
    setIsLoading(true);

    try {
      const cityData = await searchCityByName(searchTerm);
      if (cityData) {
        setSearchedCity(cityData);
      } else {
        setError(`City "${searchTerm}" not found`);
        setIsLoading(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to search for city"
      );
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <TabMenu
        locations={initialLocations}
        selectedCityIndex={selectedCityIndex}
        setSelectedCityIndex={setSelectedCityIndex}
      />
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <NextHoursForecastPanel hourlyForecastList={hourlyForecastList} />
          <FiveDaysForecastPanel dailyForecastList={dailyForecastList} />
          <Footer lastUpdatedTimestamp={lastUpdatedTimestamp} />
        </>
      )}
    </>
  );
}

export default App;
