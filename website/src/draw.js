import chartXkcd from 'chart.xkcd';

// var colorSets = [];

/**
 * draw star history graph based on data
 * @param {String} datasets example [{label:'tj/koa', data:[{x:'2016-6-12', y:12}, ...]}, ...]
 */
export default function draw(datasets) {
  const svg = document.querySelector('#chart svg');
  // console.log('before generate color', colorSets);
  const dataColors = datasets.map(x =>getRandomColor());
  // generateColor();
  // console.log('after generate color', colorSets);
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
      dataColors: dataColors,
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

// function generateColor() {
//   var color = '#';
//   color += Math.floor(Math.random()*16777215).toString(16);
//   colorSets.push(color);
// }