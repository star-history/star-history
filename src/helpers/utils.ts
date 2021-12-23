namespace utils {
  export function range(from: number, to: number): number[] {
    const r: number[] = [];
    for (let i = from; i < to; i++) {
      r.push(i);
    }
    return r;
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t);

    return d.getTime();
  }

  export function getDateString(t: Date | number | string): string {
    const d = new Date(getTimeStampByDate(t));

    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const date = d.getDate();

    return `${year}-${month}-${date}`;
  }
}

export default utils;
