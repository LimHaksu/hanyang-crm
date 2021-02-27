import { insert, select, PhoneCallRecord } from "./db";
import { getTimePlusOpeningHour } from "util/time";
import { changePropertyFromSnakeToCamel } from "util/db";

/**
 * 전화 수신 신호가 오면 이 함수를 호출하여 DB에 전화 수신 기록 저장
 * @param receivedDatetime 1970-01-01 기준 milliseconds 값
 * @param phoneNumber dash(-)포함한 문자열
 * @return 새로 추가된 자료의 행 번호 (1부터 시작)
 */
export const addPhoneCallRecord = async (
    receivedDatetime: number,
    customerName: string,
    phoneNumber: string,
    address: string,
    request: string
) => {
    try {
        const query = `INSERT INTO 
        phone_call_records(received_datetime, customer_name, phone_number, address, request)
        VALUES(?,?,?,?,?);`;
        const lastId = await insert(query, receivedDatetime, customerName, phoneNumber, address, request);
        return lastId;
    } catch (e) {
        throw e;
    }
};

/**
 * 영업 시작 시각을 고려해서 해당 일의 전화 수신기록 반환
 * @param year 년도
 * @param month 월
 * @param date 일
 */
export const getPhoneCallRecords = async (year: number, month: number, date: number) => {
    try {
        const query = `SELECT idx, received_datetime, customer_name, phone_number, address, request, order_idx
        FROM phone_call_records
        WHERE received_datetime between ? and ?
        ORDER BY received_datetime;`;
        const searchedDate = getTimePlusOpeningHour(new Date(year, month, date).getTime());
        const nextDate = searchedDate + 86_400_000; // 24 * 60 * 60 * 1000
        const rows = await select<PhoneCallRecord>(query, searchedDate, nextDate);
        return changePropertyFromSnakeToCamel(rows);
    } catch (e) {
        throw e;
    }
};
