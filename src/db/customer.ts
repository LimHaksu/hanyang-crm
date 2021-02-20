import { insert, select, update, deleteQuery, Customer } from "./db";
import { getSnakeCaseString, changePropertyFromSnakeToCamel } from "util/db";

/**
 * 고객정보를 입력하여 등록함
 * @param phoneNumber 전화번호 -(dash) 포함 문자열
 * @param name 고객명
 * @param address 주소
 * @param request 단골 요청사항
 */
export const addCustomer = async ({
    phoneNumber,
    name,
    address,
    request,
}: {
    phoneNumber: string;
    name: string;
    address: string;
    request: string;
}) => {
    try {
        const query = `INSERT INTO customers(phone_number, name, address, request)
        VALUES(?,?,?,?);`;
        await insert(query, phoneNumber, name, address, request);
    } catch (e) {
        throw e;
    }
};

/**
 * 검색기준과 검색어를 입력하면 검색 결과 고객리스트 반환
 * @param searchBy 검색 기준 - name , phoneNumber, address
 * @param searchKekword 검색어
 */
export const getCustomers = async ({
    searchBy,
    keyword,
}: {
    searchBy: "name" | "phoneNumber" | "address";
    keyword: string;
}) => {
    try {
        const query = `SELECT idx, phone_number, name, address, request
        FROM customers
        WHERE ${getSnakeCaseString(searchBy)} like ?;`;
        const customers = await select<Customer>(query, `%${keyword}%`);
        return changePropertyFromSnakeToCamel(customers);
    } catch (e) {
        throw e;
    }
};

/**
 * 고객 idx에 해당하는 고객 정보 수정
 * @param idx 고객 idx
 * @param phoneNumber 전화번호
 * @param customerName 고객 이름
 * @param address 주소
 * @param request 고객 요청사항
 */
export const editCustomer = async ({
    idx,
    phoneNumber,
    customerName,
    address,
    request,
}: {
    idx: number;
    phoneNumber: string;
    customerName: string;
    address: string;
    request: string;
}) => {
    try {
        const query = `UPDATE customers
        SET phone_number = ?, name = ?, address = ?, request = ?
        WHERE idx = ?;`;
        await update(query, phoneNumber, customerName, address, request, idx);
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
        const query = `DELETE FROM customers
        WHERE idx = ?;`;
        await deleteQuery(query, idx);
    } catch (e) {
        throw e;
    }
};
