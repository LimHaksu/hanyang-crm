import { insert, select, update, deleteQuery, Customer } from "./db";
import { getSnakeCaseString, changePropertyFromSnakeToCamel } from "util/db";
import { Customer as CustomerType, SearchBy, OrderByCustomer } from "module/customer";

interface OrderForCustomer {
    idx: number;
    order_time: number;
    payment_method: string;
    order_request: string;
    product_idx: number;
    product_name: string;
    product_amount: number;
    product_price: number;
    old_products_names: string;
    old_price: string;
}

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
    startIndex = 0,
}: {
    searchBy: SearchBy;
    keyword: string;
    startIndex?: number;
}): Promise<CustomerType[]> => {
    try {
        const query = `SELECT idx, phone_number, name customer_name, address, request
        FROM customers
        WHERE is_deleted = 0 AND ${getSnakeCaseString(searchBy)} like ?
        ORDER BY phone_number
        LIMIT ${startIndex},20;`;
        const customers = await select<Customer>(query, `%${keyword}%`);
        return changePropertyFromSnakeToCamel<CustomerType[]>(customers);
    } catch (e) {
        throw e;
    }
};

export const getCustomer = async ({ searchBy, keyword }: { searchBy: SearchBy; keyword: string }) => {
    try {
        const query = `SELECT idx, phone_number, name customer_name, address, request
        FROM customers
        WHERE is_deleted = 0 AND ${getSnakeCaseString(searchBy)} like ?
        ORDER BY phone_number
        LIMIT 1;`;
        const customers = await select<Customer>(query, `%${keyword}`);
        return changePropertyFromSnakeToCamel<CustomerType>(customers);
    } catch (e) {
        throw e;
    }
};

/**
 * 고객 idx를 이용하여 고객이 주문한 주문목록 가져오기
 * @param customerIdx 고객 idx
 */
export const getOrdersByCustomer = async (customerIdx: number): Promise<OrderByCustomer[]> => {
    try {
        const querySelectOrder = `SELECT o.idx idx, o.order_datetime order_time, o.payment_method payment_method, o.request order_request, op.product_idx product_idx, op.product_count product_amount, p.name product_name , p.price product_price , o.old_products_names old_products_names, o.old_price old_price
        FROM customers c
        LEFT JOIN orders o
        ON c.idx = o.customer_idx
        LEFT JOIN orders_products op
        ON o.idx = op.order_idx
        LEFT JOIN products p
        ON op.product_idx = p.idx
        WHERE c.idx = ?;`;
        const orders = await select<OrderForCustomer>(querySelectOrder, customerIdx);
        if (orders[0].idx === null) {
            return [];
        }
        const dic: {
            [idx: number]: {
                order_request: string;
                order_time: number;
                payment_method: string;
                products: {
                    idx: number;
                    name: string;
                    price: number;
                    amount: number;
                }[];
                old_products?: string;
                old_price?: string;
            };
        } = {};
        orders.forEach(
            ({
                idx,
                order_request,
                order_time,
                payment_method,
                product_amount,
                product_idx,
                product_name,
                product_price,
                old_products_names,
                old_price,
            }) => {
                if (old_products_names) {
                    dic[idx] = {
                        order_request,
                        order_time,
                        payment_method,
                        products: [],
                        old_products: old_products_names,
                        old_price: old_price,
                    };
                } else if (idx in dic) {
                    dic[idx].products.push({
                        idx: product_idx,
                        name: product_name,
                        price: product_price,
                        amount: product_amount,
                    });
                } else {
                    dic[idx] = { order_request, order_time, payment_method, products: [] };
                }
            }
        );
        const result: OrderByCustomer[] = [];
        const camelCaseOrders = changePropertyFromSnakeToCamel<{
            [idx: number]: {
                orderRequest: string;
                orderTime: number;
                paymentMethod: string;
                products: {
                    idx: number;
                    name: string;
                    price: number;
                    amount: number;
                }[];
                old_products?: string;
                old_price?: string;
            };
        }>(dic);
        Object.keys(camelCaseOrders).forEach((idx: string) => {
            result.push({ ...camelCaseOrders[+idx], idx: +idx });
        });
        result.sort((a, b) => b.orderTime - a.orderTime);
        return changePropertyFromSnakeToCamel<OrderByCustomer[]>(result);
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
 * 고객 idx에 해당하는 고객정보 삭제 soft delete
 * @param idx 고객 idx
 */
export const removeCustomer = async (idx: number) => {
    try {
        const query = `UPDATE customers
        SET is_deleted = 1
        WHERE idx = ?;`;
        await deleteQuery(query, idx);
    } catch (e) {
        throw e;
    }
};
