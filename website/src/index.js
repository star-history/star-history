import getStarHistory from '../../core/getStarHistory';
import draw from './draw';
import notie from 'notie'

let data = [];
let CSVContent = "";
let csvData = [];
let token = localStorage.getItem('star-history-github-token');
drawAddTokenBtn(token);

// fetch data accoding to hash
if (location.hash !== '') {
  const repoArr = location.hash.slice(1).split('&')
  repoArr.forEach(async repo => {
    await fetchDataAndDraw(repo, token);
  });
}

async function getRepoNameFetchAndDraw() {
  // get repo str (format: 'timqian/star-history')
  let repo = ''
  let rawRepoStr = document.getElementById('repo').value;
  if (rawRepoStr.includes('github.com')) {
    rawRepoStr += '\/'      // make sure url end with /
    repo = /github.com\/(\S*?\/\S*?)[\/#?]/.exec(rawRepoStr)[1];
  } else {
    repo = rawRepoStr == '' ? 'timqian/star-history' : rawRepoStr;
  }

  for (let item of data) {
    if (item.label == repo) {
      notie.alert({ text: 'This repo is already on the chart', type: 'warning' });
      return;
    }
  }

  token = localStorage.getItem('star-history-github-token');
  await fetchDataAndDraw(repo, token);
}

document.querySelector('#repo').addEventListener('keyup', async (e) => {
  if (e.keyCode === 13) {
    await getRepoNameFetchAndDraw();
  }
});

document.getElementById('theBtn').addEventListener('click', async event => {
  event.preventDefault();
  await getRepoNameFetchAndDraw();
});

const localToken = localStorage.getItem('star-history-github-token');
if (localToken) {
  document.getElementById('tokenInput').value = localToken;
}

document.getElementById('addTokenBtn').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('.modal').classList.add('is-active');
});

document.getElementById('closeModalBtn').addEventListener('click', e => {
  e.preventDefault();
  document.querySelector('.modal').classList.remove('is-active');
});

document.getElementById('saveTokenBtn').addEventListener('click', e => {
  e.preventDefault();
  const token = document.getElementById('tokenInput').value;
  localStorage.setItem('star-history-github-token', token);
  document.querySelector('.modal').classList.remove('is-active');
  drawAddTokenBtn(token);
});

document.getElementById('clearBtn').addEventListener('click', () => {
  data = []
  location.hash = ''
  document.querySelector('#chart').innerHTML = '<svg></svg>'
});

document.getElementById('shareBtn').addEventListener('click', (e) => {
  e.preventDefault();
  copyToClipboard(window.location.href);
  notie.alert({text:'Url copied', type:'success'});
})

document.getElementById('CSVBtn').addEventListener('click', (e) => {
  e.preventDefault();
  downloadCSV();
  notie.alert({text:'CSV Downloaded', type:'success'});
})

async function fetchDataAndDraw(repo, token) {

  document.getElementById('theBtn').setAttribute("disabled", "disabled");
  document.getElementById('theBtn').classList.add('is-loading');

  try {
    const starHistory = await getStarHistory(repo, token);
    // new data
    data.push({
      label: repo,
      data: starHistory.map((item) => {
        return {
          x: new Date(item.date),
          y: Number(item.starNum)
        }
      }),
    });
    //fetch date and starhistory of last added repo into csvData array
    let dateTimeArr = data[data.length - 1]["data"];
    for (let i = 0; i < dateTimeArr.length; ++i){
      let dateTime = []
      dateTime.push(repo);
      dateTime.push(dateTimeArr[i]['x'].toString());
      dateTime.push(String(dateTimeArr[i]['y']));
      csvData.push(dateTime);
    }
    //convert csvData array into format suitable for CSV download
    CSVContent = csvData.map(row => row.map(item => (typeof item === 'string' && item.indexOf(',') >= 0) ? `"${item}"`: String(item)).join(',')).join('\n');

    draw(data);

    if (location.hash === '') {
      location.hash += repo;
    } else if (location.hash.length >=3 && !location.hash.includes(repo)) { // minimal sample of repo name 'a/b'

      location.hash += '&' + repo;
    }
  } catch (error) {
    console.dir(error);
    if (error.response.status === 403) {
      notie.alert({ text: 'GitHub API rate limit exceeded', type:'warning' });

      setTimeout(() => {
        document.querySelector('.modal').classList.add('is-active');
      }, 2500);
    } else if (error.response.status === 404) {
      notie.alert({text:'No such repo', type:'warning' })
    } else {
      notie.alert({text:'Some unexpected error happened, try again', type:'warning' })
    }
  }

  document.getElementById('theBtn').removeAttribute("disabled");
  document.getElementById('theBtn').classList.remove('is-loading');
  document.getElementById('button-group').style.visibility = 'visible';
  document.getElementById('chart').style.visibility = 'visible';
}

function drawAddTokenBtn(token) {
  let verb = 'Add';
  if (token) {
    verb = 'Edit'
  }
  document.getElementById('addTokenBtn').innerHTML = '<strong>' + verb + ' access token</strong>';
  document.getElementById('modalCardTitle').innerHTML = verb + ' GitHub access token';
}

// copy text to clipboard
// ref: https://stackoverflow.com/a/46118025
function copyToClipboard(text){
  var dummy = document.createElement("input");
  document.body.appendChild(dummy);
  dummy.setAttribute('value', text);
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

// download CSV
// ref: https://stackoverflow.com/questions/18848860/javascript-array-to-csv
function downloadCSV(){
  var encodedUri = encodeURI('data:text/csv;charset=utf-8,' + CSVContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'star-history.csv');
  link.click();
}

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('#'+burger.dataset.target);
  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });
})();

// for discount message
document.querySelector('#delete-discount').addEventListener('click', (e) => {
  window.localStorage.setItem('delete-discount', 'true');
  document.querySelector('#discount-message').style.display = 'none';
});

if (window.localStorage.getItem('delete-discount')) document.querySelector('#discount-message').style.display = 'none';
