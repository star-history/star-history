import axios from 'axios';

// https://github.com/blog/1509-personal-api-tokens
const access_token = ['ee3a172df9aaa8c858b5585ca53391cec47b20c0', 'da9f64e669b91d89f5abe19b313ab07a54b7c974', '31eee536d05b169b3e184e152d18775f7166123b', '9da45c0ed04c77c47278bb260d7c6b6c2c9b9fa8', 'd96ed1e68bec80e725db8f23327a96839def67a6', '569e1881d1b810c39e35c650f056ea6fac05a400'];

const axiosGit = axios.create({
  headers: {
    Accept: 'application/vnd.github.v3.star+json',
  },
  params: {
    access_token: access_token[Math.floor(Math.random() * access_token.length)],
  },
});

const sampleNum = 15; // number of sample requests to do

const range = n => Array.apply(null, {length: 5}).map((_, i) => i + 1);

/**
 * generate Urls and pageNums
 * @param {sting} repo - eg: 'timqian/jsCodeStructure'
 * @return {object} {sampleUrls, pageIndexes} - urls to be fatched(length <=10) and page indexes
 */
async function generateUrls(repo) {

  const initUrl = `https://api.github.com/repos/${repo}/stargazers`;   // used to get star infors
  const initRes = await axiosGit.get(initUrl).catch(res => {
    throw 'No such repo or network error!';
  });

  /** 
   * link Sample (no link when star < 30):
   * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=2>;
   * rel="next", 
   * <https://api.github.com/repositories/40237624/stargazers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=4>; 
   * rel="last"
   */
  const link = initRes.headers.link;

  const pageNum = link ? /next.*?page=(\d*).*?last/.exec(link)[1] : 1; // total page number

  // used to calculate total stars for this page
  const pageIndexes = pageNum <= sampleNum ?
    range(pageNum) :
    range(sampleNum).map(n => Math.round(n / sampleNum * pageNum) - 1); // for bootstrap bug

  // store sampleUrls to be rquested
  const sampleUrls = pageIndexes.map(pageIndex => `${initUrl}?page=${pageIndex}`);

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

  // promises to request sampleUrls

  const getArray = sampleUrls.map(url => axiosGit.get(url));

  const resArray = await Promise.all(getArray)
    .catch(res => {
      throw 'Github api limit exceeded, Try in the new hour!'
    });

  let starHistory = null;

  if (pageIndexes[pageIndexes.length - 1] > sampleNum) {
    starHistory = pageIndexes.map((p, i) => {
      return {
        date: resArray[i].data[0].starred_at.slice(0, 10),
        starNum: 30 * (p - 1),
      };
    });
  } else {
    // we have every starredEvent: we can use them to generate 15 (sampleNum) precise points
    const starredEvents = resArray.reduce((acc, r) => acc.concat(r.data), []);

    const firstStarredAt = new Date(starredEvents[0].starred_at);
    const daysSinceRepoCreatedAt = Math.round((new Date()) - firstStarredAt) / (1000*60*60*24);

    const dates = Array.from(new Array(50)).map((_, i) => {
      const firstStarredAtCopy = new Date(firstStarredAt);
      firstStarredAtCopy.setDate(firstStarredAtCopy.getDate() + Math.floor((daysSinceRepoCreatedAt / 50) * (i + 1)));
      return firstStarredAtCopy.toISOString().slice(0, 10);
    }, []);

    starHistory = dates.map((d, i) => {
      let starNum = 0;
      const firstStarredEventAfterDate = starredEvents.find((se, i) => {
        if (se.starred_at.slice(0, 10) >= d) {
          starNum = i + 1;
          return true
        }

        return false;
      })

      return firstStarredEventAfterDate && {
        date: firstStarredEventAfterDate.starred_at.slice(0, 10),
        starNum: starNum
      };
    }).filter(x => x);
  }

  // Better view for less star repos (#28) and for repos with too much stars (>40000)
  const resForStarNum = await axiosGit.get(`https://api.github.com/repos/${repo}`)
    .catch(res => {
      throw 'Github api limit exceeded, Try in the new hour!'
    });
  const starNumToday = resForStarNum.data.stargazers_count;
  const today = new Date()
  const monthFormat = today.getMonth() + 1 > 10 ? today.getMonth() + 1 : `0${today.getMonth() + 1}`
  const dateFormat = today.getDate() > 10 ? today.getDate() : `0${today.getDate()}`

  starHistory.push({
    date: `${today.getFullYear()}-${monthFormat}-${dateFormat}`,
    starNum: starNumToday
  })

  return starHistory;
}

export default getStarHistory;
