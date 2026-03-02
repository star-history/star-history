import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { formatDate, getWeeklyDate, exportLeaderboard, exportWeeklyRanking, exportRepos, exportStarCounts } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(__dirname, "data"), { recursive: true });
const db = new Database(path.join(__dirname, "star.db"), { readonly: true });

const today = formatDate(new Date());
exportLeaderboard(db, today);
exportWeeklyRanking(db, getWeeklyDate(db));
exportRepos(db);
exportStarCounts(db, today);

db.close();
