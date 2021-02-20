import { insert, select, update, deleteQuery, Customer, Product } from "./db";
import { getTimeWithOpeningHour } from "util/time";
import { Order } from "module/order";

// UnitOfWork 패턴 transaction 적용하기

/**
 * 주문정보를 입력하면 해당 주문의 고객정보, 주문정보를 저장
 * @param orderTime 주문시각 1970-01-01 기준 milliseconds
 * @param customerName 고객명
 * @param phoneNumber 고객 전화번호 dash(-) 포함 문자열
 * @param address 고객 주소
 * @param customerRequest 단골 고객 요청사항
 * @param products 주문 상품 리스트
 * @param orderRequest 주문 요청사항
 * @param paymentMethod 결제 수단
 */
export const addOrder = async (order: Order) => {
    const {
        orderTime,
        customerName,
        phoneNumber,
        address,
        customerRequest,
        products,
        orderRequest,
        paymentMethod,
    } = order;
    // order_datetime, customer_idx, payment_method, request
    // 고객정보 : 이름, 전화, 주소, 단골 요청사항
    // 주문정보 : 상품명, 가격, 수량
    // 주문 요청사항, 현금/카드/선결제 , 선결제-배민/요기요/쿠팡
    try {
        // 전화번호를 이용하여 고객이 존재하는지 체크
        const querySelectCustomer = `SELECT idx
         FROM customer
         WHERE phone_number = ?;`;
        const [customer] = await select<Customer>(querySelectCustomer, phoneNumber);
        let customerIdx = -1;
        if (customer) {
            // 존재하면 고객 idx로 입력된 고객정보 업데이트
            const queryUpdateCustomer = `UPDATE customer
            SET name = ?, address = ?, requests = ?
            WHERE idx = ?;`;
            const changes = await update(queryUpdateCustomer, customerName, address, customerRequest, customer.idx);
            if (changes === 1) {
                customerIdx = customer.idx;
            }
        } else {
            // 존재하지 않으면 add 고객 -> 새로 생성된 고객 idx 리턴
            const queryInsertCustomer = `INSERT INTO
            customer(phone_number, name, address, request)
            values(?,?,?,?);`;
            customerIdx = await insert(queryInsertCustomer, phoneNumber);
        }
        if (customerIdx !== -1) {
            // order_datetime = 현재시각, customer_idx = 고객id, payment_method, request 로 order 생성 -> order_idx 리턴
            const queryInsertOrder = `INSERT INTO
            order(order_datetime, customer_idx, payment_method, request)
            values(?,?,?,?);`;
            const orderIdx = await insert(queryInsertOrder, orderTime, customerIdx, paymentMethod, orderRequest);

            // order_idx와 product_idx, product_count로 order_product 생성
            const queryInsertOrderProduct = `INSERT INTO
            order_product(order_idx, product_idx, product_count)
            values(?,?,?);`;
            await Promise.all(
                products.map(({ idx, amount }) => insert(queryInsertOrderProduct, orderIdx, idx, amount))
            );
        }
    } catch (e) {
        throw e;
    }
};

interface OrderForList {
    order_idx: number;
    order_datetime: number;
    customer_name: string;
    phone_number: string;
    address: string;
    order_request: string;
    customer_request: string;
    payment_method: string;
}

/**
 * 영업 시작 시각을 고려해서 해당 일의 주문 목록 반환
 * @param year 년도
 * @param month 월
 * @param date 일
 */
export const getOrders = async (year: number, month: number, date: number) => {
    /**
     * 주문시각, 고객명, 전화번호, 배송지, 상품명, 요청사항, 결제방법, 가격
     * order: idx, order_datetime, customer_idx, payment_method, request
     * customer: idx, phone_number, name, address, request
     * order_product: order_idx, product_idx, product_count
     */
    try {
        const querySelectOrder = `SELECT a.idx order_idx, order_datetime, b.name customer_name, phone_number, address, a.request order_request, b.request customer_request, payment_method
        FROM order a join customer b
        ON a.customer_idx = b.idx
        WHERE a.idx = ? AND a.order_datetime BETWEEN ? AND ?;`;
        const searchedDate = getTimeWithOpeningHour(new Date(year, month, date).getTime());
        const nextDate = searchedDate + 86_400_000; // 24 * 60 * 60 * 1000
        const orders = await select<OrderForList>(querySelectOrder, searchedDate, nextDate);

        const querySelectOrderProduct = `SELECT product_name, product_price, product_count
        FROM order_product a join product b
        on a.product_idx = b.idx
        where order_idx = ?;`;
        const ordersWithProducts = await Promise.all(
            orders.map(async (order) => {
                const productsByOrder = await select<Product & { count: number }>(
                    querySelectOrderProduct,
                    order.order_idx
                );
                return { ...order, products: productsByOrder };
            })
        );

        return ordersWithProducts.map((order) => {
            const totalPrice = order.products.reduce((acc, product) => acc + product.price * product.count, 0);
            return { ...order, totalPrice };
        });
    } catch (e) {
        throw e;
    }
};

/**
 * 주문정보를 입력하면 해당 주문의 고객정보, 주문정보를 수정
 * @param orderIdx 수정할 주문 idx
 * @param customerIdx 수정할 주문의 고객 idx
 * @param customerName 고객명
 * @param phoneNumber 고객 전화번호 dash(-) 포함 문자열
 * @param address 고객 주소
 * @param customerRequest 단골 고객 요청사항
 * @param products 주문 상품 리스트
 * @param orderRequest 주문 요청사항
 * @param paymentMethod 결제 수단
 */
export const editOrder = async (
    orderIdx: number,
    customerIdx: number,
    customerName: string,
    phoneNumber: string,
    address: string,
    customerRequest: string,
    products: (Product & { count: number })[],
    orderRequest: string,
    paymentMethod: "현금" | "카드" | "선결제(배민)" | "선결제(요기요)" | "선결제(쿠팡)"
) => {
    // order_datetime, customer_idx, payment_method, request
    // 고객정보 : 이름, 전화, 주소, 단골 요청사항
    // 주문정보 : 상품명, 가격, 수량
    // 주문 요청사항, 현금/카드/선결제 , 선결제-배민/요기요/쿠팡
    try {
        // 고객 idx를 이용하여 고객 정보 업데이트
        const queryUpdateCustomer = `UPDATE customer
            SET phone_number = ?, name = ?, address = ?, requests = ?
            WHERE idx = ?;`;
        const changesCustomer = await update(
            queryUpdateCustomer,
            phoneNumber,
            customerName,
            address,
            customerRequest,
            customerIdx
        );
        if (changesCustomer === 1) {
            // 주문 idx를 이용하여 주문 정보 업데이트
            const queryUpdateOrder = `UPDATE order
            SET payment_method = ?, request = ?
            WHERE idx = ?;`;
            const changesOrder = await update(queryUpdateOrder, paymentMethod, orderRequest, orderIdx);

            if (changesOrder === 1) {
                // 기존 order_product 삭제
                const queryDeleteOrderProduct = `DELETE
                FROM order_product
                WHERE order_idx = ?;`;
                await deleteQuery(queryDeleteOrderProduct, orderIdx);

                // order_idx와 product_idx, product_count로 order_product 생성
                const queryInsertOrderProduct = `INSERT INTO
                order_product(order_idx, product_idx, product_count)
                values(?,?,?);`;
                await Promise.all(
                    products.map(({ idx, count }) => insert(queryInsertOrderProduct, orderIdx, idx, count))
                );
            }
        }
    } catch (e) {
        throw e;
    }
};

/**
 * 주문 Idx를 이용하여 주문 삭제
 * @param orderIdx 삭제할 주문 Idx
 */
export const removeOrder = async (orderIdx: number) => {
    try {
        const queryDeleteOrder = `DELETE
        FROM order
        WHERE idx = ?;`;
        await deleteQuery(queryDeleteOrder, orderIdx);
    } catch (e) {
        throw e;
    }
};
