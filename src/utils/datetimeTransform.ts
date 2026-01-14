/**
 * Converts UTC timestamp to local time timestamp
 * @param utcTimestamp - Unix timestamp in UTC
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns Unix timestamp adjusted to local time
 */
export function convertToLocalTimestamp(
  utcTimestamp: number,
  timezoneOffset: number
): number {
  return utcTimestamp + timezoneOffset;
}

/**
 * Converts UTC timestamp to local time date string
 * @param utcTimestamp - Unix timestamp in UTC (seconds)
 * @param timezoneOffset - Timezone offset in seconds from UTC
 * @returns Date string in format "YYYY-MM-DD HH:MM:SS" (local time)
 */
export function convertTimestampToLocalDateString(
  utcTimestamp: number,
  timezoneOffset: number
): string {
  // Create Date from UTC timestamp (multiply by 1000 to convert seconds to milliseconds)
  const utcDate = new Date(utcTimestamp * 1000);

  // Calculate local time by adding timezone offset in milliseconds
  const localTime = utcDate.getTime() + timezoneOffset * 1000;
  const localDate = new Date(localTime);

  // Format as YYYY-MM-DD HH:MM:SS
  // Use UTC methods because we've already adjusted the time
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(localDate.getUTCDate()).padStart(2, "0");
  const hours = String(localDate.getUTCHours()).padStart(2, "0");
  const minutes = String(localDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(localDate.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
