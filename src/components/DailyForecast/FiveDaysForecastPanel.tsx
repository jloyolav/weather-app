import { type DailyForecastType } from "../../utils/types";
import DayForecastCard from "./DayForecastCard";

type Props = {
  dailyForecastList: DailyForecastType[];
};

function FiveDaysForecastPanel({ dailyForecastList }: Props) {
  return (
    <div className="card w-75 mb-3 mx-auto mt-3">
      <div className="card-body">
        <h5 className="card-title">Next 5 days</h5>

        <hr className="my-2" />

        <div className="d-flex flex-column">
          {dailyForecastList.map((dailyForecast, index) => (
            <div key={dailyForecast.time}>
              <DayForecastCard dailyForecast={dailyForecast} />
              {index < dailyForecastList.length - 1 && <hr className="my-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FiveDaysForecastPanel;
