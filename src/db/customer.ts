import { insert, select, update, deleteQuery, Customer } from "./db";

/**
 * 고객정보를 입력하여 등록함
 * @param phoneNumber 전화번호 -(dash) 포함 문자열
 * @param name 고객명
 * @param address 주소
 * @param request 단골 요청사항
 */
export const addCustomer = async (phoneNumber: string, name: string, address: string, request: string) => {
    try {
        const query = `INSERT INTO customer(phone_number, name, address, request)
        VALUES(?,?,?,?);`;
        const lastId = await insert(query, phoneNumber, name, address, request);
        return lastId;
    } catch (e) {
        throw e;
    }
};

/**
 * 검색기준과 검색어를 입력하면 검색 결과 고객리스트 반환
 * @param by 검색 기준 - name , phoneNumber, address
 * @param searchKekword 검색어
 */
export const getCustomers = async (by: "name" | "phoneNumber" | "address", searchKekword: string) => {
    try {
        const query = `SELECT idx, phone_number, name, address, request
        FROM customer
        WHERE ${by} like %?%;`;
        const customers = await select<Customer>(query, searchKekword);
        return customers;
    } catch (e) {
        throw e;
    }
};

/**
 * 고객 idx에 해당하는 고객 정보 수정
 * @param idx 고객 idx
 * @param phoneNumber 전화번호
 * @param name 고객 이름
 * @param address 주소
 * @param request 고객 요청사항
 */
export const editCustomer = async (
    idx: number,
    phoneNumber: string,
    name: string,
    address: string,
    request: string
) => {
    try {
        const query = `UPDATE customer
        SET phone_number = ?, name = ?, address = ?, request = ?
        WHERE idx = ?;`;
        await update(query, phoneNumber, name, address, request, idx);
    } catch (e) {
        throw e;
    }
};

/**
 * 고객 idx에 해당하는 고객정보 삭제
 * @param idx 고객 idx
 */
export const removeCustomer = async (idx: number) => {
    try {
        const query = `DELETE FROM customer
        WHERE idx = ?;`;
        await deleteQuery(query, idx);
    } catch (e) {
        throw e;
    }
};
