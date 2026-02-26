import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { exportLeaderboard, exportWeeklyRanking, exportRepos, exportRepoCards } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, "data.db"), { readonly: true });

exportLeaderboard(db);
exportWeeklyRanking(db);
exportRepos(db);
exportRepoCards(db);

db.close();
