interface XYData {
  label: string;
  data: {
    x: Date;
    y: number;
  }[];
}

// legend position
// 1: upLeft
// 2: upRight
// 3: downLeft
// 4: downRight
// Reference: https://github.com/timqian/chart.xkcd/blob/master/src/config.js
type LegendPosition = 1 | 2 | 3 | 4;

interface ChartXkcdXYConfig {
  title: string;
  xLabel: string;
  yLabel: string;
  data: {
    datasets: XYData[];
  };
  options: {
    xTickCount: number;
    yTickCount: number;
    legendPosition: LegendPosition;
    showLine: boolean;
    timeFormat: string;
    dotSize: number;
    dataColor?: string[];
  };
}

declare module "chart.xkcd" {
  class XY {
    constructor(svg: SVGElement, config: ChartXkcdXYConfig);
  }
  // ...
}
