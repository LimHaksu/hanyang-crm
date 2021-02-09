const path = window.require("path");
const { remote } = window.require("electron");
const sqlite3 = window.require("sqlite3").verbose();
const dbFile = path.join(remote.app.getAppPath(), path.sep + "database.db").replace(path.sep + "app.asar", "");
const db = new sqlite3.Database(dbFile);
export default db;
