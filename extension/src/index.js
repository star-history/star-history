import d3 from 'd3';
import nv from 'nvd3';

import getStarHistory from '../../core/getStarHistory';

// make link clickable - http://stackoverflow.com/questions/8915845/chrome-extension-open-a-link-from-popup-html-in-a-new-tab
window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
});

const localToken = localStorage.getItem('star-history-github-token');
if (localToken) {
  document.getElementById('token-input').value = localToken;
}

// used to store date and star numbers
let data = [];

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  document.getElementById('chart').style.display = 'none';
  document.getElementById('theGif').style.display = 'block';

  const tab = tabs[0];
  const url = tab.url + '\/';
  console.assert(typeof url == 'string', 'tab.url should be a string');

  // get repo from tab url
  let repo;
  try {
    repo = /github.com\/(\S*?\/\S*?)[\/#?]/.exec(url)[1];
  } catch (err) {
    document.getElementById('container').innerHTML = '<h2>No repo found</h2>';
    throw 'no repo found';
  }

  try {
    const starHistory = await getStarHistory(repo, localToken);
    data.push({
      key: repo,
      values: starHistory.map((item) => {
        return {
          x: new Date(item.date),
          y: Number(item.starNum)
        }
      }),
    });
  } catch (error) {
    document.getElementById('container').innerHTML = `<h3 style="padding: 20px;">GitHub API rate limit exceeded. Consider add you personal access token to the plugin(Click the setting button)</h3>`;
  }

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

  document.getElementById('chart').style.display = 'block';
  document.getElementById('theGif').style.display = 'none';

});

document.getElementById('setting-ico').addEventListener('click', (e) => {
  e.preventDefault();
  if (document.getElementById('setting-div').style.visibility === 'hidden') {
    document.getElementById('setting-div').style.visibility = 'visible';
  } else {
    document.getElementById('setting-div').style.visibility = 'hidden';
  }
});

document.getElementById('setting-save-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const token = document.getElementById('token-input').value;
  localStorage.setItem('star-history-github-token', token);
  document.getElementById('setting-div').style.visibility = 'hidden';
});

