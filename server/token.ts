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

  const tokens = envTokenString.split(",");
  // Check token usable
  for (const token of tokens) {
    try {
      await api.getRepoStargazersCount("bytebase/star-history", token);
      savedTokens.push(token);
    } catch (error) {
      console.error(`token is unusable: ${token}`);
    }
  }
};

export const getNextToken = () => {
  const currentIndex = index;
  index++;
  if (index >= savedTokens.length) {
    index = 0;
  }

  return savedTokens[currentIndex];
};
