import WeatherIcon from "../Commons/WeatherIcon";
import { type DailyForecastType } from "../../utils/types";

type Props = {
  dailyForecast: DailyForecastType;
};

function DayForecastCard({ dailyForecast }: Props) {
  // Format date from "YYYY-MM-DD" to "Fri, Nov 1"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="d-flex flex-row align-items-center py-3">
      <div className="me-3">
        <WeatherIcon
          iconName={dailyForecast.iconName}
          description={dailyForecast.description}
          width="60px"
          height="60px"
        />
      </div>
      <div className="flex-grow-1 text-center">
        <div className="fw-bold text-dark mb-1">
          {formatDate(dailyForecast.dateString)}
        </div>
        <div className="text-secondary small">{dailyForecast.description}</div>
      </div>
      <div className="text-dark ms-3">
        <span className="me-2">
          {Math.round(dailyForecast.maxTemperature)}°
        </span>
        <span className="text-muted">
          {Math.round(dailyForecast.minTemperature)}°
        </span>
      </div>
    </div>
  );
}

export default DayForecastCard;
