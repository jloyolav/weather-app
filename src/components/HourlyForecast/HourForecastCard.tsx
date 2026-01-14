import WeatherIcon from "../Commons/WeatherIcon";
import { type HourlyForecastType } from "../../utils/types";

type Props = {
  hourlyForecast: HourlyForecastType;
};

function HourForecastCard({ hourlyForecast }: Props) {
  //time format: Time of the forecasted data, Unix, UTC, e.g: 1684926000
  const convertUnixTimeToLocalTime = (time: number) => {
    const localTime = new Date(time * 1000).toLocaleTimeString();
    return localTime;
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-3 px-4 bg-white">
      <div className="text-dark fw-bold fs-5 mb-1">
        {hourlyForecast.temperature}°
      </div>
      <div className="text-info mb-3">{hourlyForecast.humidity}%</div>
      <WeatherIcon
        iconName={hourlyForecast.iconName}
        description={hourlyForecast.description}
        width="80px"
        height="80px"
      />
      <div className="text-secondary">
        {convertUnixTimeToLocalTime(hourlyForecast.time)}
      </div>
    </div>
  );
}

export default HourForecastCard;
