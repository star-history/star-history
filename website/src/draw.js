import chartXkcd from 'chart.xkcd';

/**
 * draw star history graph based on data
 * @param {String} datasets example [{label:'tj/koa', data:[{x:'2016-6-12', y:12}, ...]}, ...]
 */
export default function draw(datasets) {
  const svg = document.querySelector('#chart svg');
  const dataColors = datasets.map(x =>getRandomColor());
  new chartXkcd.XY(svg, {
    title: 'Star history',
    yLabel: 'Github stars',
    xLabel: 'Date',
    data: {
      datasets
    },    
    options: {
      xTickCount: 5,
      yTickCount: 5,
      legendPosition: chartXkcd.config.positionType.upLeft,
      showLine: true,
      timeFormat: 'MM/DD/YYYY',
      dotSize: 0.5,
      dataColors: dataColors
    },
  })
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
