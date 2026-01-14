type Props = {
  iconName: string;
  description: string;
  width?: string;
  height?: string;
};

function WeatherIcon({ iconName, description, width, height }: Props) {
  const iconUrl = `https://openweathermap.org/img/wn/${iconName}@2x.png`;
  return (
    <img
      src={iconUrl}
      alt={description}
      className="mb-3"
      style={{ width: width ?? "80px", height: height ?? "80px" }}
    />
  );
}

export default WeatherIcon;
