import * as fs from "fs";
import * as process from "process";
import logger from "./logger";
import api from "../common/api";

// Token env file path in render.com: All secret files you create are available to read at the root of your repo.
const ENV_PATH_IN_RENDER = "./token.env";
// For local dev, you need to pass the ENVPATH value in env variables.
// e.g. ENVPATH=PATH_TO_YOUR_FILE yarn dev
// For production, we set a token.env file in render.com,
// and copy of the file is store in bytebase/secret repo on GitHub.
const envFilePath = process.env.ENVPATH || ENV_PATH_IN_RENDER;

const savedTokens: string[] = [];
let index = 0;

export const initTokenFromEnv = async () => {
  if (!fs.existsSync(envFilePath)) {
    logger.error("Token file not found with path ", envFilePath);
    process.exit(-1);
  }
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
