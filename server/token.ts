import { env, exit } from "process";
import api from "../common/api";

const savedTokens: string[] = [];
let index = 0;

export const initTokenFromEnv = async () => {
  const envTokenString = env.TOKEN;
  if (!envTokenString) {
    console.error("Token not found");
    exit(-1);
  }

  const tokenList = envTokenString.split(",");
  // Call GitHub API to check token usability
  for (const token of tokenList) {
    try {
      await api.getRepoStargazersCount("bytebase/star-history", token);
      savedTokens.push(token);
    } catch (error) {
      console.error(`token ${token} is unusable, error: ${error}`);
    }
  }

  if (savedTokens.length === 0) {
    console.error("No usable token");
    exit(-1);
  }

  console.log(`Usable token amount: ${savedTokens.length}`);
};

// Get the next token for requests.
export const getNextToken = () => {
  index = (index + 1) % savedTokens.length;
  return savedTokens[index];
};
