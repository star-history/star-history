import axios from 'axios';

const getConfig = {
  headers: {
    Accept: 'application/vnd.github.v3.star+json',
  },
};
const sampleNum = 18; // number of requests to do

/**
 *	generate Urls and pageNums to be used
 * @param {sting} repo - eg: 'timqian/jsCodeStructure'
 * @return {object} {samplePageUrls, pageIndexes} - urls to be fatched(length <=10) and page indexes
 */
export default async function(repo) {
  const initUrl = `https://api.github.com/repos/${repo}/stargazers`;
  const res = await axios.get(initUrl, getConfig).catch(e => {
    console.log(e); // throw don't workalert(`Sorry, Git API rate limit exceeded for your ip address, please wait for an hour`);
    alert(`Sorry, Git API rate limit exceeded for your ip address, please wait for an hour`);
  });
  const link = res.headers.link;

  console.log(res);
  if (!link) {
    return {
      samplePageUrls: [],
      pageIndexes: [],
    };
  } else {
    const pageNumArray = /next.*?page=(\d*).*?last/.exec(link);
    const pageNum = pageNumArray[1];
    let samplePageUrls = [];
    let pageIndexes = [];
    if (pageNum <= sampleNum) {
      for (let i = 2; i <= pageNum; i++) {
        pageIndexes.push(i);
        samplePageUrls.push(initUrl + '?page=' + i);
      }
    } else {
      for (let i = 1; i <= sampleNum; i++) {
        let pageIndex = Math.round(i / sampleNum * pageNum) - 1; //for bootstrap bug
        pageIndexes.push(pageIndex);
        samplePageUrls.push(initUrl + '?page=' + pageIndex);
      }
    }
    console.log(samplePageUrls);
    return {
      samplePageUrls, pageIndexes,
    };
  }
}
