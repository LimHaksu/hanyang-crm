import { insert, select, PhoneCallRecord } from "./db";
import { getTimeWithOpeningHour } from "util/time";

/**
 * 전화 수신 신호가 오면 이 함수를 호출하여 DB에 전화 수신 기록 저장
 * @param receivedDatetime 1970-01-01 기준 milliseconds 값
 * @param cidMachineIdx USB 목록에서 선택한 항목의 순서(가장위가 0번)
 * @param phoneNumber dash(-)포함한 문자열
 */
export const addPhoneRecord = async (receivedDatetime: number, cidMachineIdx: number, phoneNumber: string) => {
    const query = `INSERT INTO 
    phone_call_record(received_datetime, phone_number, cid_machine_idx)
    VALUES(?,?,?);`;
    try {
        const data = await insert(query, receivedDatetime, cidMachineIdx, phoneNumber);
        return data;
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
    const query = `SELECT received_datetime, phone_number, cid_machine_idx, order_idx
    FROM phone_call_record
    WHERE received_datetime between ? and ?;`;
    const searchedDate = getTimeWithOpeningHour(new Date(year, month, date).getTime());
    const nextDate = searchedDate + 86_400_000; // 24 * 60 * 60 * 1000
    try {
        const rows = await select<PhoneCallRecord>(query, searchedDate, nextDate);
        return rows;
    } catch (e) {
        throw e;
    }
};
