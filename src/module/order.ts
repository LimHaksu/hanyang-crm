import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";

export interface Product {
    name: string;
    price: number;
    count: number;
}

export type PaymentMethod = "현금" | "카드" | "선결제(배민)" | "선결제(요기요)" | "선결제(쿠팡)";

export interface Order {
    idx: number;
    orderTime: number;
    productName: string;
    request: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    customerRequest: string;
    products: Product[];
    price: number;
    orderRequest: string;
    paymentMethod: PaymentMethod;
}

const ADD_ORDER = "order/ADD_ORDER";

export const addOrderAction = createAction(
    ADD_ORDER,
    (
        idx: number,
        orderTime: number,
        productName: string,
        request: string,
        customerName: string,
        phoneNumber: string,
        address: string,
        customerRequest: string,
        products: Product[],
        price: number,
        orderRequest: string,
        paymentMethod: PaymentMethod
    ) => ({
        idx,
        orderTime,
        productName,
        request,
        customerName,
        phoneNumber,
        address,
        customerRequest,
        products,
        price,
        orderRequest,
        paymentMethod,
    })
)();

const actions = { addOrderAction };

interface OrderState {
    orders: Order[];
}

const initialState: OrderState = {
    orders: [],
};

type OrderAction = ActionType<typeof actions>;

const order = createReducer<OrderState, OrderAction>(initialState, {
    [ADD_ORDER]: (state, { payload: order }) =>
        produce(state, (draft) => {
            draft.orders.push(order);
        }),
});

export default order;
