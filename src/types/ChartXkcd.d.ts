interface XYData {
  label: string;
  data: {
    x: Date | number;
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

interface BaseConfig {
  title: string;
  xLabel: string;
  yLabel: string;
  data: any;
  options: Partial<{
    xTickCount: number;
    yTickCount: number;
    legendPosition: LegendPosition;
    showLine: boolean;
    timeFormat: string;
    isDuration: boolean;
    dotSize: number;
    dataColor?: string[];
  }>;
}

interface XYChartData {
  datasets: XYData[];
}

interface XYChartConfig extends BaseConfig {
  data: XYChartData;
}

declare namespace chartXkcd {
  class XY {
    constructor(svg: SVGElement, config: XYChartConfig);
  }
  // ...
}
