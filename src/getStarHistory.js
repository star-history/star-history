import axios from 'axios';

// https://github.com/blog/1509-personal-api-tokens
const access_token = ['9da45c0ed04c77c47278bb260d7c6b6c2c9b9fa8', 'd96ed1e68bec80e725db8f23327a96839def67a6', '569e1881d1b810c39e35c650f056ea6fac05a400'];

const axiosGit = axios.create({
  headers: {
    Accept: 'application/vnd.github.v3.star+json',
  },
  params: {
    access_token: access_token[Math.floor(Math.random() * access_token.length)],
  },
});

const sampleNum = 18; // number of sample requests to do

/**
 * generate Urls and pageNums
 * @param {sting} repo - eg: 'timqian/jsCodeStructure'
 * @return {object} {sampleUrls, pageIndexes} - urls to be fatched(length <=10) and page indexes
 */
async function generateUrls(repo) {
  let sampleUrls = [];  // store sampleUrls to be rquested
  let pageIndexes = [];  // used to calculate total stars for this page

  const initUrl = `https://api.github.com/repos/${repo}/stargazers`;   // used to get star infors
  const initRes = await axiosGit.get(initUrl).catch(res => {
    throw 'No such repo or netowrk err!';
  });

  /* link Sample (no link when star < 30):
    <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=2>;
    rel="next", <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=4>; rel="last"
  */
  const link = initRes.headers.link;

  if (!link) {
    throw 'Too few stars (less than 30)!';
  }

  const pageNum = /next.*?page=(\d*).*?last/.exec(link)[1]; // total page number

  // generate { sampleUrls, pageIndexes } accordingly
  if (pageNum <= sampleNum) {
    for (let i = 2; i <= pageNum; i++) {
      pageIndexes.push(i);
      sampleUrls.push(initUrl + '?page=' + i);
    }
  } else {
    for (let i = 1; i <= sampleNum; i++) {
      let pageIndex = Math.round(i / sampleNum * pageNum) - 1; //for bootstrap bug
      pageIndexes.push(pageIndex);
      sampleUrls.push(initUrl + '?page=' + pageIndex);
    }
  }

  console.log("pageIndexes", pageIndexes);
  return { sampleUrls, pageIndexes };
}

/**
 * get star history
 * @param {sting} repo - eg: 'timqian/jsCodeStructure'
 * @return {array} history - eg: [{date: 2015-3-1,starNum: 12}, ...]
 */
async function getStarHistory(repo) {

  const { sampleUrls, pageIndexes } = await generateUrls(repo).catch(e => {
    throw e;
  });

  // promisese to request sampleUrls
  const getArray = sampleUrls.map(url => axiosGit.get(url));

  const resArray = await Promise.all(getArray).catch(res => {
    throw 'Github api limit exceeded, Try in the new hour!'
  });

  const starHistory = pageIndexes.map((p, i) => {
    return {
      date: resArray[i].data[0].starred_at.slice(0, 10),
      starNum: 30 * (p - 1),
    };
  });

  const today = new Date()
  starHistory.push({
    date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
    starNum: starHistory[starHistory.length - 1].starNum
  })

  return starHistory;
}

export default getStarHistory;
