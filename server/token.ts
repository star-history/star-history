import { env, exit } from "process";

let savedTokens: string[] = [];
let index = 0;

export const initTokenFromEnv = () => {
  const envTokenString = env.TOKEN;
  if (!envTokenString) {
    console.error("Token not found");
    exit(-1);
  }

  const tokens = envTokenString.split(",");
  savedTokens = tokens;
};

export const getNextToken = () => {
  const currentIndex = index;
  index++;
  if (index >= savedTokens.length) {
    index = 0;
  }

  return savedTokens[currentIndex];
};
