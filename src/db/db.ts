import { RunResult } from "sqlite3";
const path = window.require("path");
const { remote } = window.require("electron");
const sqlite3 = window.require("sqlite3").verbose();
const dbFile = path.join(remote.app.getAppPath(), path.sep + "database.db").replace(path.sep + "app.asar", "");
const db = new sqlite3.Database(dbFile);
export default db;

export interface PhoneCallRecord {
    received_datetime: number;
    phone_number: string;
    cid_machine_idx: number;
    order_idx: number | null;
}

/**
 *
 * @param query SQL 쿼리
 * @param whereParams prepared statement에 들어갈 파라미터
 * @return insert 쿼리 결과 삽입된 행의 갯수
 */
export const insert = async (query: string, ...whereParams: (number | string)[]): Promise<number> => {
    try {
        const changes: number = await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(query, ...whereParams, function (this: RunResult, error: Error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(this.changes);
                });
            });
        });
        return changes;
    } catch (e) {
        throw e;
    }
};

/**
 *
 * @param query SQL 쿼리
 * @param whereParams prepared statement에 들어갈 파라미터
 * @return select 쿼리 결과의 배열
 */
export const select = async <T>(query: string, ...whereParams: (number | string)[]): Promise<T[]> => {
    try {
        const rows: T[] = await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.all(query, ...whereParams, (error: Error, rows: T[]) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(rows);
                });
            });
        });
        return rows;
    } catch (e) {
        throw e;
    }
};
