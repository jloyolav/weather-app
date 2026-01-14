import type { LocationType } from "../../utils/types";

type Props = {
  locations: LocationType[];
  selectedCityIndex: number;
  setSelectedCityIndex: (index: number) => void;
};

function TabMenu({
  locations,
  selectedCityIndex,
  setSelectedCityIndex,
}: Props) {
  return (
    <div className="container">
      <ul className="nav nav-tabs">
        {locations.map((location, index) => (
          <li className="nav-item" key={index}>
            <a
              className={`nav-link ${
                selectedCityIndex === index ? "active" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedCityIndex(index);
              }}
            >
              {location.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TabMenu;
