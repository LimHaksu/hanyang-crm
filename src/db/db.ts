import { RunResult } from "sqlite3";
const path = window.require("path");
const { remote } = window.require("electron");
const sqlite3 = window.require("sqlite3").verbose();
const dbFile = path.join(remote.app.getPath("userData"), path.sep + "database.db");
const db = new sqlite3.Database(dbFile);
db.get("PRAGMA foreign_keys = ON");
export default db;

export interface Category {
    idx: number;
    name: string;
    lexo_rank: string;
}

export interface Customer {
    idx: number;
    phone_number: string;
    name: string;
    address: string;
    request: string;
}

export interface Order {
    idx: number;
    order_datetime: number;
    customer_idx: number;
    payment_method: string;
    request: string;
    phone_call_record_idx: number;
}

export interface OrderProduct {
    order_idx: number;
    product_idx: number;
    product_count: number;
}

export interface PhoneCallRecord {
    idx: number;
    received_datetime: number;
    customer_name: string | null;
    phone_number: string;
    address: string | null;
    order_idx: number | null;
}

export interface Product {
    idx: number;
    name: string;
    price: number;
    lexo_rank: string;
    category_idx: number;
}

/**
 *
 * @param query INSERT SQL 쿼리
 * @param valuesParams prepared statement의 values 절에 들어갈 파라미터
 * @return insert 쿼리 결과 삽입된 행의 id
 */
export const insert = async (query: string, ...valuesParams: (number | string)[]): Promise<number> => {
    try {
        const lastID: number = await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(query, ...valuesParams, function (this: RunResult, error: Error) {
                    if (error) {
                        reject(error);
                    }
                    resolve(this.lastID);
                });
            });
        });
        return lastID;
    } catch (e) {
        throw e;
    }
};

/**
 *
 * @param query SELECT SQL 쿼리
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

/**
 *
 * @param query UPDATE SQL 쿼리
 * @param setOrWhereParams prepared statement의 SET, WHERE 절에 들어갈 파라미터
 * @return update 쿼리 결과 바뀐 행의 갯수
 */
export const update = async (query: string, ...setOrWhereParams: (number | string)[]): Promise<number> => {
    try {
        const changes: number = await new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run(query, ...setOrWhereParams, function (this: RunResult, error: Error) {
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
 * @param query DELETE SQL 쿼리
 * @param whereParams prepared statement의 WHERE 절에 들어갈 파라미터
 * @return update 쿼리 결과 바뀐 행의 갯수
 */
export const deleteQuery = async (query: string, ...whereParams: (number | string)[]): Promise<number> => {
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
