import * as fs from "fs";
import * as process from "process";
import logger from "./logger";
import api from "../common/api";

const savedTokens: string[] = [];
let index = 0;

export const initTokenFromEnv = async () => {
  const envFilePath = process.env.ENVPATH || "/etc/secrets/.env";
  const envTokenString = fs.readFileSync(envFilePath).toString();
  if (!envTokenString) {
    logger.error("Token not found");
    process.exit(-1);
  }

  const tokenList = envTokenString.split(/\r?\n/);
  // Call GitHub API to check token usability
  for (const token of tokenList) {
    try {
      await api.getRepoStargazersCount("bytebase/star-history", token);
      savedTokens.push(token);
    } catch (error) {
      logger.error(`Token ${token} is unusable`, error);
    }
  }

  if (savedTokens.length === 0) {
    logger.error("No usable token");
    process.exit(-1);
  }

  logger.info(`Usable token amount: ${savedTokens.length}`);
};

// Get the next token for requests.
export const getNextToken = () => {
  index = (index + 1) % savedTokens.length;
  return savedTokens[index];
};
