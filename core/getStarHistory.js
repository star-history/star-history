import axios from 'axios';

// number of sample requests to do
const sampleNum = 15;

// return [1,2, ..., n]
const range = n => Array.apply(null, {length: n}).map((_, i) => i + 1);

/**
 * get star history
 * @param {String} repo - eg: 'timqian/jsCodeStructure'
 * @param {String} token - github access token
 * @return {Array} history - eg: [{date: 2015-3-1,starNum: 12}, ...]
 */
async function getStarHistory(repo, token) {
  const axiosGit = axios.create({
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: token ? `token ${token}` : undefined,
    },
  });

  async function generateContributors(repo) {

    const initUrl = `https://api.github.com/repos/${repo}/contributors`;   // used to get star info
    const initRes = await axiosGit.get(initUrl);

    const link = initRes.headers.link;

    const pageNum = link ? /next.*?page=(\d*).*?last/.exec(link)[1] : 1; // total page number

    // used to calculate total stars for this page
    const pageIndexesCon = range(pageNum).slice(1, pageNum)

    // store sampleUrls to be requested
    const sampleUrlsCon = pageIndexesCon.map(pageIndex => `${initUrl}?page=${pageIndex}`);

    console.log("pageIndexes", pageIndexesCon);
    return { firstPageCon: initRes, sampleUrlsCon, pageIndexesCon };
  }


  /**
   * generate Urls and pageNums
   * @param {sting} repo - eg: 'timqian/jsCodeStructure'
   * @return {object} {sampleUrls, pageIndexes} - urls to be fetched(length <=10) and page indexes
   */
  async function generateUrls(repo, login) {
    const initUrl = `https://api.github.com/repos/${repo}/commits?author=` + login;   // used to get star info
    const initRes = await axiosGit.get(initUrl);

    /** 
     * link Sample (no link when star < 30):
     * <https://api.github.com/repositories/40237624/contributers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=2>;
     * rel="next", 
     * <https://api.github.com/repositories/40237624/contributers?access_token=2e71ec1017dda2220ccba0f6922ecefd9ea44ac7&page=4>; 
     * rel="last"
     */
    const link = initRes.headers.link;
    console.log(initRes.headers.link)

    const pageNum = link ? /next.*?page=(\d*).*?last/.exec(link)[1] : 1; // total page number

    // used to calculate total stars for this page
    const pageIndexes = range(pageNum).slice(1, pageNum)

    console.log("pageNum: ", pageNum);

    // store sampleUrls to be requested
    const sampleUrls = pageIndexes.map(pageIndex => `${initUrl}&page=${pageIndex}`);

    return { firstPage: initRes, sampleUrls, pageIndexes };
  }

  const { sampleUrlsCon, pageIndexesCon, firstPageCon } = await generateContributors(repo);
  const getArrayCon = [firstPageCon].concat(sampleUrlsCon.map(url => axiosGit.get(url)));
  const resArrayCon = await Promise.all(getArrayCon);
  console.log("Contributors: ", resArrayCon);

  var contributors = new Array();
  for (var i in resArrayCon) {
    for (var j in resArrayCon[i].data) {
      contributors.push(resArrayCon[i].data[j].login);
    }
  }
  console.log("ContributorsList: ", contributors);

  var commitTimeList = new Array()
  for (var i in contributors) {
    console.log(i, ": Contributor: ", contributors[i]);
    const { sampleUrls, pageIndexes, firstPage } = await generateUrls(repo, contributors[i]);
    const getArray = [firstPage].concat(sampleUrls.map(url => axiosGit.get(url)));
    const resArray = await Promise.all(getArray);

    const lastRes = resArray[resArray.length - 1];
    try {
      const firstCommitTime = lastRes.data[lastRes.data.length - 1].commit.author.date;
      commitTimeList.push(firstCommitTime);
    } catch (e) {
      console.log("Not found id");
      continue
    }
  }
  commitTimeList.sort();

  console.log("firstCommitTime: ", commitTimeList);

  // we have every starredEvent: we can use them to generate 15 (sampleNum) precise points

  const firstStarredAt = new Date(commitTimeList[0]);
  const daysSinceRepoCreatedAt = Math.round((new Date()) - firstStarredAt) / (1000*60*60*24);

  const dates = Array.from(new Array(50)).map((_, i) => {
    const firstStarredAtCopy = new Date(firstStarredAt);
    firstStarredAtCopy.setDate(firstStarredAtCopy.getDate() + Math.floor((daysSinceRepoCreatedAt / 50) * (i + 1)));
    return firstStarredAtCopy.toISOString().slice(0, 10);
  }, []);

  console.log("dates",dates)
  var starHistory = dates.map((d, i) => {
    let starNum = 0;
    const firstStarredEventAfterDate = commitTimeList.find((se, i) => {
      if (se.slice(0, 10) >= d) {
        starNum = i + 1;
        return true
      }

      return false;
    })

    return firstStarredEventAfterDate && {
      date: firstStarredEventAfterDate.slice(0, 10),
      starNum: starNum
    };
  }).filter(x => x);

  console.log("starHistory",starHistory)

  return starHistory;
}

export default getStarHistory;
