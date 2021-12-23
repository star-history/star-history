import utils from "./utils";

type ResponseType<T = unknown> = {
  response: Response;
  data: T;
};

type RequestConfig = {
  method: string;
  url: string;
  data?: any;
  headers?: HeadersInit;
};

async function request<T>(config: RequestConfig): Promise<ResponseType<T>> {
  const { method, url, data } = config;
  const requestConfig: RequestInit = {
    method,
  };

  if (data !== undefined) {
    requestConfig.headers = {
      "Content-Type": "application/json",
    };
    requestConfig.body = JSON.stringify(data);
  }

  if (config.headers) {
    requestConfig.headers = {
      ...requestConfig.headers,
      ...config.headers,
    };
  }

  return fetch(url, requestConfig)
    .then(async (response) => {
      if (response.status >= 400 && response.status < 600) {
        throw {
          response,
          data: null,
        };
      }
      const responseData = (await response.json()) as T;
      return {
        response,
        data: responseData,
      };
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

namespace api {
  export async function getRepoStarRecords(repo: string, token = "") {
    const getGithubRepoStar = (repo: string, page = 1, token = "") => {
      return request<{ starred_at: string }[]>({
        method: "GET",
        url: `https://api.github.com/repos/${repo}/stargazers?page=${page}`,
        headers: {
          Accept: "application/vnd.github.v3.star+json",
          Authorization: token ? `token ${token}` : "",
        },
      });
    };

    const { response } = await getGithubRepoStar(repo, 1, token);

    const headerLink = response.headers.get("link") ?? "";
    const MAX_REQUEST_AMOUNT = 15;

    let pageCount = 1;
    const regResult = /next.*?page=(\d*).*?last/.exec(headerLink);
    if (regResult) {
      if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
        pageCount = Number(regResult[1]);
      }
    }
    const requestPages: number[] = [];
    if (pageCount < MAX_REQUEST_AMOUNT) {
      requestPages.push(...utils.range(1, pageCount));
    } else {
      let i = 1;
      while (i < pageCount) {
        requestPages.push(i);
        i += Math.round(pageCount / MAX_REQUEST_AMOUNT);
      }
    }

    const resArray = await Promise.all(
      requestPages.map((page) => {
        return getGithubRepoStar(repo, page, token);
      })
    );

    const starRecords: {
      date: string;
      count: number;
    }[] = [];

    resArray.map((res, index) => {
      const { data } = res;
      if (data.length > 0) {
        const starRecord = data[0];
        starRecords.push({
          date: utils.getDateString(starRecord.starred_at),
          count: 30 * requestPages[index],
        });
      }
    });

    const { data } = await request<{ stargazers_count: number }>({
      method: "GET",
      url: `https://api.github.com/repos/${repo}`,
      headers: {
        Accept: "application/vnd.github.v3.star+json",
        Authorization: token ? `token ${token}` : "",
      },
    });

    starRecords.push({
      date: utils.getDateString(Date.now()),
      count: data.stargazers_count,
    });

    return starRecords;
  }
}

export default api;
