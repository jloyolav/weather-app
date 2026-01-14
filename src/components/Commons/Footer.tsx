import { convertTimestampToLocalDateString } from "../../utils/datetimeTransform";

type Props = {
  lastUpdatedTimestamp: number;
};

function Footer({ lastUpdatedTimestamp }: Props) {
  // Get timezone offset in seconds from UTC
  // getTimezoneOffset() returns minutes, and we need to invert the sign
  // because it returns UTC->local offset, but we need local->UTC offset
  const timezoneOffset = -new Date().getTimezoneOffset() * 60;

  const getFormattedDate = (): string => {
    return convertTimestampToLocalDateString(
      lastUpdatedTimestamp,
      timezoneOffset
    );
  };

  return (
    <footer
      className="bg-primary text-white text-end py-2"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="container">
        <span>Last updated on: {getFormattedDate()}</span>
      </div>
    </footer>
  );
}

export default Footer;
