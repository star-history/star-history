import axios from "axios";
import utils from "./utils";

const PER_PAGE = 30;

namespace api {
  export async function getRepoStargazers(
    repo: string,
    token = "",
    page?: number
  ) {
    let url = `https://api.github.com/repos/${repo}/stargazers?per_page=${PER_PAGE}`;

    if (page !== undefined) {
      url = `${url}&page=${page}`;
    }
    return axios.get(url, {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: token ? `token ${token}` : "",
      },
    });
  }

  export async function getRepoStargazersCount(repo: string, token = "") {
    const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: token ? `token ${token}` : "",
      },
    });

    return data.stargazers_count;
  }

  export async function getRepoStarRecords(repo: string, token = "") {
    const patchRes = await getRepoStargazers(repo, token);

    const headerLink = patchRes.headers["link"] || "";
    const MAX_REQUEST_AMOUNT = 15;

    let pageCount = 1;
    const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

    if (regResult) {
      if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
        pageCount = Number(regResult[1]);
      }
    }

    if (pageCount === 1 && patchRes?.data?.length === 0) {
      throw {
        status: patchRes.status,
        data: [],
      };
    }

    const requestPages: number[] = [];
    if (pageCount < MAX_REQUEST_AMOUNT) {
      requestPages.push(...utils.range(1, pageCount));
    } else {
      utils.range(1, MAX_REQUEST_AMOUNT).map((i) => {
        requestPages.push(Math.round((i * pageCount) / MAX_REQUEST_AMOUNT) - 1);
      });
      if (!requestPages.includes(1)) {
        requestPages.unshift(1);
      }
    }

    const resArray = await Promise.all(
      requestPages.map((page) => {
        return getRepoStargazers(repo, token, page);
      })
    );

    const starRecordsMap: Map<string, number> = new Map();

    if (requestPages.length < MAX_REQUEST_AMOUNT) {
      const starRecordsData: {
        starred_at: string;
      }[] = [];
      resArray.map((res) => {
        const { data } = res;
        starRecordsData.push(...data);
      });
      for (let i = 0; i < starRecordsData.length; ) {
        starRecordsMap.set(
          utils.getDateString(starRecordsData[i].starred_at),
          i + 1
        );
        i += Math.floor(starRecordsData.length / MAX_REQUEST_AMOUNT) || 1;
      }
    } else {
      resArray.map(({ data }, index) => {
        if (data.length > 0) {
          const starRecord = data[0];
          starRecordsMap.set(
            utils.getDateString(starRecord.starred_at),
            PER_PAGE * (requestPages[index] - 1)
          );
        }
      });
    }

    const starAmount = await getRepoStargazersCount(repo, token);
    starRecordsMap.set(utils.getDateString(Date.now()), starAmount);

    const starRecords: {
      date: string;
      count: number;
    }[] = [];

    starRecordsMap.forEach((v, k) => {
      starRecords.push({
        date: k,
        count: v,
      });
    });

    return starRecords;
  }
}

export default api;
