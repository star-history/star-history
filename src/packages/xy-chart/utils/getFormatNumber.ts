export type NumberUnitType = 1 | 1000;

export const getNumberFormatUnit = (n: number): NumberUnitType => {
  if (n >= 300) {
    return 1000;
  }

  return 1;
};

const getFormatNumber = (n: number, type: NumberUnitType = 1) => {
  if (type === 1) {
    return `${n}`;
  }

  return `${(n / 1000).toFixed(1)}k`;
};

export default getFormatNumber;
