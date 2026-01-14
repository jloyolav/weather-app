# Weather App

A weather forecast application built with React and TypeScript that displays hourly and daily weather forecasts for cities around the world.

## Technologies Used

- **React 19.2.0** - UI library
- **TypeScript 5.9.3** - Type safety
- **Vite 7.2.4** - Build tool and development server
- **Bootstrap 5.3.8** - CSS framework for styling
- **OpenWeatherMap API** - Weather data source

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd weather-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:

```env
VITE_API_KEY=your_api_key_here
```

You can get a free API key by signing up at [OpenWeatherMap](https://openweathermap.org/api). This project uses the Free Access API _3-hour forecast for 5 days_. https://openweathermap.org/price#freeaccess

## Running the Project

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Run ESLint to check for code issues:

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Commons/          # Shared components (Header, Footer, TabMenu, WeatherIcon)
│   ├── DailyForecast/    # Daily forecast components
│   └── HourlyForecast/   # Hourly forecast components
├── utils/
│   ├── api.ts                    # API calls to OpenWeatherMap
│   ├── citySearch.ts             # City search functionality
│   ├── datetimeTransform.ts      # Timezone and date conversion utilities
│   ├── types.ts                  # TypeScript type definitions
│   └── weatherDataTransform.ts   # Weather Data transformation logic
├── assets/                # Static assets (CSV files, images)
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

## Additional considerations and technical decitions

- The search form only uses the city name, without considering the country. The search will return the first city found in the csv matching the search term. Also, the search is normalized, so it is case insensitive.

- The forecast times were transformed from UTC to the local time of the requested city.

- To show the hourly forecast, only forecasts with a utc time in the future and within 24 hours (from the time of the request) are shown. This is to avoid showing forecast that are too in the future and showing past periods. Also, showing only events on the same day could lead to showing no items if consulted too close to midnight.

### Limitations of the API

The only available APIs for the provided API key were:

- Current weather data: https://openweathermap.org/current
- 5 day / 3 hour forecast: https://openweathermap.org/forecast5

The first one was not used, since it was not required for the assigned tasks. However, the second API, which was used for this assignment, had some format limitations that required additional definitions and processing in order to achieve the requirements.

The 5 day / 3 hour forecast API DOES NOT PROVIDE hourly forecast data. It neither provides daily summarized data. The API response is as follows:

```JSON
{
  ...
  "list": [
    {
      "dt": 1661871600,
      "main": {
        "temp": 296.76,
        "feels_like": 296.98,
        "temp_min": 296.76,
        "temp_max": 297.87,
        ...
        "humidity": 69,
        ...
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10d"
        }
      ],
      ...
      "dt_txt": "2022-08-30 15:00:00"
    },
    {
      "dt": 1661882400,
      "main": {
        "temp": 295.45,
        "feels_like": 295.59,
        "temp_min": 292.84,
        "temp_max": 295.45,
        ...
        "humidity": 71,
        ...
      },
      "weather": [
        {
          "id": 500,
          "main": "Rain",
          "description": "light rain",
          "icon": "10n"
        }
      ],
      ...
      "dt_txt": "2022-08-30 18:00:00"
    },
    ...
  ],
  "city": {
    "id": 3163858,
    "name": "Zocca",
    "coord": {
      "lat": 44.34,
      "lon": 10.99
    },
    "country": "IT",
    "population": 4593,
    "timezone": 7200,
    ...
  }
}
```

This format has a few consequences:

- We only have the weather forecast every 3 hours, not hourly, so the UI shows that instead of the hourly version shown in the sample mockup provided.

- We don't have a max temperature, min temperature, and weather forecast for the day in general (with the icon and the description 'Clear throughout the day'), as shown in the mockup. We only have min, max and weather object (with the icon and short description) for each of those time spans of 3 hours within the day. In order to achieve the required view, more processing of the data was needed.

  - The icon and description for the daily forecast weather was selected from the forecast provided for the time span closest to noon (12 pm), as a middle point of the day.

  - The min and max temperature was selected filtering all of the forecast items of the needed day, and searching for the minimum and maximum temperature forecasted throughout those day's records. For example, the min temp could be associated to the forecast for 3 am local hour, and the max temp could be from the forecast for 3 pm local hour.

```

```
