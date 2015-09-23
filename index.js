import d3 from 'd3';
import nv from 'nvd3';
import axios from 'axios';
import getStarHistory from './getStarHistory';
require("babel-core/polyfill"); //??????????????????没有它会出错  http://babeljs.io/docs/usage/polyfill/

let code = window.location.search.slice(6);
console.log(typeof code);

if (code.length < 1) {
  window.location.href='https://github.com/login/oauth/authorize?client_id=4e4f2621589085b864d7';
}

const postConfig = {
  params:{
    code,
    client_id: '4e4f2621589085b864d7',
    client_secret: 'd990379890dd26d973f227304d4c88b10528c76b',
  },
};
console.log(postConfig);
(async function(){
  const res = await axios.post('https://github.com/login/oauth/access_token',postConfig)
    .catch(err => {console.log(err);});
  console.log(res);
})();


let data = [];

d3.select("button").on("click", async function() {
  let repo = document.getElementById('repo').value
  repo = repo == '' ? 'petkaantonov/bluebird' : repo;
  console.log(repo);

  const starHistory = await getStarHistory(repo).catch(function(err) {
    console.log(err);
  });
  console.log(starHistory);

  // 新数据集
  data.push({
    key: repo,
    values: starHistory.map((item) => {
      return {
        x: new Date(item.date),
        y: Number(item.starNum)
      }
    }),
  });
  console.log(JSON.stringify(data));

  nv.addGraph(function() {
    var chart = nv.models.lineChart()
      .useInteractiveGuideline(true)
      .color(d3.scale.category10().range());

    chart.xAxis
      .tickFormat(function(d) {
        return d3.time.format('%x')(new Date(d))
      });

    chart.yAxis
      .axisLabel('Stars')
      .tickFormat(d3.format('d'));

    d3.select('#chart svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);

    nv.utils.windowResize(chart.update);

    return chart;
  });
});
