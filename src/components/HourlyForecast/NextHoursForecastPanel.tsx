import { type HourlyForecastType } from "../../utils/types";
import HourForecastCard from "./HourForecastCard";

type Props = {
  hourlyForecastList: HourlyForecastType[];
};

function NextHoursForecastPanel({ hourlyForecastList }: Props) {
  return (
    <div className="card w-75 mb-3 mx-auto mt-3">
      <div className="card-body">
        <h5 className="card-title">Next hours</h5>

        <hr className="my-2" />

        <div className="d-flex flex-row overflow-x-auto flex-nowrap">
          {hourlyForecastList.map((hourlyForecast, index) => (
            <div key={hourlyForecast.time} className="d-flex">
              <HourForecastCard hourlyForecast={hourlyForecast} />
              {index < hourlyForecastList.length - 1 && (
                <div className="border-end align-self-stretch"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NextHoursForecastPanel;
