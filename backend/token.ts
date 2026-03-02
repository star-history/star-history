import * as fs from "fs";
import * as process from "process";
import logger from "./logger.js";
import api from "../shared/common/api.js";

// Token env file path in render.com: All secret files you create are available to read at the root of your repo.
const ENV_PATH_IN_RENDER = "./token.env";
// For local dev, you need to pass the ENVPATH value in env variables.
// e.g. ENVPATH=PATH_TO_YOUR_FILE pnpm dev
// For production, we set a token.env file in render.com,
// and the copy of the file is stored at https://github.com/bytebase/secret/tree/master/token/star-history.
const envFilePath = process.env.ENVPATH || ENV_PATH_IN_RENDER;

const savedTokens: string[] = [];
let index = 0;

// Tokens that hit rate limit are cooled down for 15 minutes.
const COOLDOWN_MS = 15 * 60 * 1000;
const exhaustedUntil = new Map<string, number>();

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
      await api.getRepoStargazersCount("star-history/star-history", token);
      savedTokens.push(token);
    } catch (error) {
      logger.error(`Token ${token.slice(0, 8)}...${token.slice(-4)} is unusable`, error);
    }
  }

  if (savedTokens.length === 0) {
    logger.error("No usable token");
    process.exit(-1);
  }

  logger.info(`Usable token amount: ${savedTokens.length}`);
};

// Mark a token as rate-limited so it is skipped for COOLDOWN_MS.
export const markTokenExhausted = (token: string) => {
  exhaustedUntil.set(token, Date.now() + COOLDOWN_MS);
  logger.warn(`Token ${token.slice(0, 8)}... rate-limited, cooling down for ${COOLDOWN_MS / 60000}m`);
};

// Return token pool stats for observability.
export const getTokenStats = () => {
  const now = Date.now();
  let exhaustedCount = 0;
  exhaustedUntil.forEach((until) => {
    if (now < until) exhaustedCount++;
  });
  return { total: savedTokens.length, exhausted: exhaustedCount };
};

// Get the next available token, skipping rate-limited ones.
// Returns null if all tokens are exhausted.
export const getNextToken = (): string | null => {
  const now = Date.now();
  for (let i = 0; i < savedTokens.length; i++) {
    index = (index + 1) % savedTokens.length;
    const token = savedTokens[index];
    const until = exhaustedUntil.get(token);
    if (!until || now >= until) {
      if (until) exhaustedUntil.delete(token);
      return token;
    }
  }
  return null;
};
