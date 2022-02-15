import { env, exit } from "process";
import { EventEmitter } from "events";
import api from "../common/api";

const savedTokens: string[] = [];
let index = 0;

// simple mutex lock with EventEmitter.
const ee = new EventEmitter();
let lock = false;

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
export const getNextToken = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (lock) {
      ee.once("ready", getNextToken);
    } else {
      lock = true;
      const currentIndex = index;
      index = (currentIndex + 1) % savedTokens.length;
      resolve(savedTokens[currentIndex]);
      lock = false;
      ee.emit("ready");
    }
  });
};
