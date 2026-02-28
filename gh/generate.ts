import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exportLeaderboard, exportWeeklyRanking, exportRepos } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(path.join(__dirname, "data"), { recursive: true });
const db = new Database(path.join(__dirname, "data.db"), { readonly: true });

exportLeaderboard(db);
exportWeeklyRanking(db);
exportRepos(db);

db.close();
