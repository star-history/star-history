import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(duration);
dayjs.extend(relativeTime);

export type DurationUnitType = "day" | "week" | "month" | "year";

export const getTimestampFormatUnit = (timestamp: number): DurationUnitType => {
  let timelineUnit: DurationUnitType = "day";
  if (dayjs.duration(timestamp).asYears() > 1) {
    timelineUnit = "year";
  } else if (dayjs.duration(timestamp).asMonths() > 1) {
    timelineUnit = "month";
  } else if (dayjs.duration(timestamp).asWeeks() > 1) {
    timelineUnit = "week";
  }
  return timelineUnit;
};

const getFormatTimeline = (
  timestamp: number,
  type: DurationUnitType = "day"
) => {
  if (timestamp === 0) {
    return "day one";
  }

  const seconds = Math.floor(timestamp / 1000);
  const days = Math.floor(seconds / 60 / 60 / 24);
  const weeks = Math.floor(days / 7);
  const months = (days / 30).toFixed(0);
  const years = (days / 365).toFixed(0);

  if (type === "day") {
    if (days === 1) {
      return "a day";
    }
    return `${days} days`;
  } else if (type === "week") {
    if (weeks === 1) {
      return "a week";
    }
    return `${weeks} weeks`;
  } else if (type === "month") {
    if (Number(months) === 1) {
      return "a month";
    }
    return `${months} months`;
  } else {
    if (Number(years) === 1) {
      return "a year";
    }
    return `${years} years`;
  }
};

export default getFormatTimeline;
