interface CityData {
  city_id: string;
  city_name: string;
  lat: number;
  lon: number;
}

import citiesCsv from "../assets/cities_20000.csv?raw";

let citiesCache: CityData[] | null = null;

/**
 * Loads and parses the cities CSV file
 * @returns Promise with array of city data
 */
async function loadCitiesData(): Promise<CityData[]> {
  if (citiesCache) {
    return citiesCache;
  }

  try {
    const lines = citiesCsv.trim().split("\n");

    // Skip header line
    const dataLines = lines.slice(1);

    citiesCache = dataLines.map((line) => {
      const fields = line.split(",");
      return {
        city_id: fields[0],
        city_name: fields[1],
        lat: parseFloat(fields[5]),
        lon: parseFloat(fields[6]),
      };
    });

    return citiesCache;
  } catch {
    throw new Error("Failed to load cities data");
  }
}

/**
 * Searches for a city by name in the cities CSV
 * @param searchText - The city name to search for (case-insensitive)
 * @returns Promise with the first matching city data or null if not found
 */
export async function searchCityByName(
  searchText: string
): Promise<{ lat: number; lon: number; name: string } | null> {
  //if the search term is empty, return null
  if (!searchText.trim()) {
    return null;
  }

  const cities = await loadCitiesData();
  const normalizedSearchText = searchText.trim().toLowerCase();

  const city = cities.find(
    (c) => c.city_name.toLowerCase() === normalizedSearchText
  );

  if (!city) {
    return null;
  }

  return {
    lat: city.lat,
    lon: city.lon,
    name: city.city_name,
  };
}
