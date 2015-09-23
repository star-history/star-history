import d3 from 'd3';
import nv from 'nvd3';
import getStarHistory from './getStarHistory';
require("babel-core/polyfill"); //??????????????????没有他会出错

function flatTestData() {
  return [{
    key: "Snakes",
    values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function(d) {
      var currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + d);
      return [currentDate, 0]
    })
  }];
}

let cumulativeTestData = [];

d3.select("button").on("click", async function() {
  let repo = document.getElementById('repo').value
  repo = repo == '' ? 'twbs/bootstrap' : repo;
  console.log(repo);

  const starHistory = await getStarHistory(repo).catch(function(err) {
    console.log(err);
  });
  console.log(starHistory);

  // 新数据集
  cumulativeTestData.push({
    key: repo,
    values: starHistory.map((item)=>{
      return [new Date(item.date), item.starNum]
    })
  });
  nv.addGraph(function() {
    var chart = nv.models.cumulativeLineChart()
      .useInteractiveGuideline(true)
      .x(function(d) {
        return d[0]
      })
      .y(function(d) {
        return d[1] / 100
      })
      .color(d3.scale.category10().range())
      .average(function(d) {
        return d.mean / 100;
      })
      .duration(300)
      .clipVoronoi(false);
    chart.dispatch.on('renderEnd', function() {
      console.log('render complete: cumulative line with guide line');
    });

    chart.xAxis.tickFormat(function(d) {
      return d3.time.format('%m/%d/%y')(new Date(d))
    });

    chart.yAxis.tickFormat(d3.format(',.1%'));

    d3.select('#chart1 svg')
      .datum(cumulativeTestData)
      .call(chart);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update);

    chart.dispatch.on('stateChange', function(e) {
      nv.log('New State:', JSON.stringify(e));
    });
    chart.state.dispatch.on('change', function(state) {
      nv.log('state', JSON.stringify(state));
    });

    return chart;
  });
});
