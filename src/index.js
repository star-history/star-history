import "babel-polyfill"; // for async/await http://babeljs.io/docs/usage/polyfill/
import d3 from 'd3';
import nv from 'nvd3';
import axios from 'axios';
import getStarHistory from './getStarHistory';

//
// let code = window.location.search.slice(6);
// console.log(code);
// if (code.length < 1) {
//   window.location.href='https://github.com/login/oauth/authorize?client_id=4e4f2621589085b864d7';
// } else {
//   const postData = {
//     code,
//     client_id: '4e4f2621589085b864d7',
//     client_secret: 'd990379890dd26d973f227304d4c88b10528c76b',
//   };
//
//   console.log(postData);
//   (async function(){
//     const res = await axios.post('https://github.com/login/oauth/access_token', postData)
//       .catch(err => {console.log(err);});
//     console.log('hi');
//     console.log(res);
//   })();
// }

let data = [];

d3.select("button").on("click", async function() {
  document.getElementById('theBtn').setAttribute("disabled", "disabled");
  document.getElementById('theGif').style.display = 'inline';

  let repo = document.getElementById('repo').value
  repo = repo == '' ? 'torvalds/linux' : repo;
  console.log(repo);

  const starHistory = await getStarHistory(repo).catch(function(err) {
    console.log(err);
    alert(`Sorry, Git API rate limit exceeded for your ip address, please wait for an hour`);
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

  document.getElementById('theBtn').removeAttribute("disabled");
  document.getElementById('theGif').style.display = 'none';
  console.log('hi');
});
