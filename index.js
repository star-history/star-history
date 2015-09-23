import d3 from 'd3';
import nv from 'nvd3';
import axios from 'axios';
import getStarHistory from './getStarHistory';

require("babel-core/polyfill"); //??????????????????没有它会出错  http://babeljs.io/docs/usage/polyfill/

let code = window.location.search.slice(6);
console.log(code);
if (code.length < 1) {
  window.location.href='https://github.com/login/oauth/authorize?client_id=4e4f2621589085b864d7';
}

const postData = {
  code,
  client_id: '4e4f2621589085b864d7',
  client_secret: 'd990379890dd26d973f227304d4c88b10528c76b',
  redirect_uri:'http://localhost:8080'
};

console.log(postData);
(async function(){
  const res = await axios({
  // `url` is the server URL that will be used for the request
  url: 'https://github.com/login/oauth/access_token',

  // `method` is the request method to be used when making the request
  method: 'post', // default


  // `headers` are custom headers to be sent
headers: {Accept: 'application/json'},

  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
  // When no `transformRequest` is set, must be a string, an ArrayBuffer or a hash
  data: postData,

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `responseType` indicates the type of data that the server will respond with
  // options are 'arraybuffer', 'blob', 'document', 'json', 'text'
  responseType: 'json', // default

}).catch(err => {console.log(err);});
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
