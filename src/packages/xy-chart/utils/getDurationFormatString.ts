const formatNumber = (n: number | string): number => {
  return n === parseInt(`${n}`, 10) ? parseInt(`${n}`, 10) : Number(n);
};

const getDurationFormatString = (timestamp: number) => {
  if (timestamp === 0) {
    return "day one";
  }

  const seconds = Math.floor(timestamp / 1000);
  const days = Math.floor(seconds / 60 / 60 / 24);
  const weeks = Math.floor(days / 7);
  const months = (days / 30).toFixed(1);
  const years = (days / 365).toFixed(1);

  if (Number(years) >= 1) {
    if (Number(years) === 1) {
      return "a year";
    }
    return `${formatNumber(years)} years`;
  }
  if (Number(months) >= 1) {
    if (Number(months) === 1) {
      return "a month";
    }

    return `${formatNumber(months)} months`;
  }
  if (weeks >= 1) {
    if (weeks === 1) {
      return "a week";
    }
    return `${formatNumber(weeks)} weeks`;
  }

  if (days === 1) {
    return "a day";
  }
  return `${days} days`;
};

export default getDurationFormatString;
