import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { Product } from "module/product";

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

export interface OrderForm {
    idx: number;
    orderTime: number;
    request: string;
    products: (Product & { amount: number })[];
    price: number;
    orderRequest: string;
    paymentMethod: PaymentMethod;
}

export interface OrderFormInput {
    idx?: number;
    orderTime?: number;
    request?: string;
    products?: (Product & { amount: number })[];
    price?: number;
    orderRequest?: string;
    paymentMethod?: PaymentMethod;
}

const ADD_ORDER = "order/ADD_ORDER";
const ADD_PRODUCT = "order/ADD_PRODUCT";
const CHANGE_AMOUNT = "order/CHANGE_AMOUNT";
const REMOVE_PRODUCT = "order/REMOVE_AMOUNT";

const SUBMIT_ORDER = "order/SUBMIT_ORDER";

export const setOrderFormAction = createAction(
    SET_ORDER_FORM,
    ({ idx, orderTime, request, products, price, orderRequest, paymentMethod }: OrderFormInput) => ({
        idx,
        orderTime,
        request,
        products,
        price,
        orderRequest,
        paymentMethod,
    })
)();

export const addProductAction = createAction(ADD_PRODUCT, (product: Product & { amount: number }) => product)();
export const changeAmountAction = createAction(CHANGE_AMOUNT, (index: number, amount: number) => ({ index, amount }))();
export const removeProductAction = createAction(REMOVE_PRODUCT, (index: number) => index)();

export const submitOrderAction = createAction(
    SUBMIT_ORDER,
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

const actions = { submitOrderAction, addProductAction, changeAmountAction, removeProductAction };

interface OrderState {
    orders: Order[];
    orderForm: OrderForm;
}

const initialState: OrderState = {
    orders: [],
    orderForm: {
        idx: -1,
        orderTime: -1,
        request: "",
        products: [{ idx: 1, name: "안녕", amount: 1, categoryIdx: 1, lexoRank: "aa", price: 10000 }],
        price: 0,
        orderRequest: "",
        paymentMethod: "현금",
    },
};

type OrderAction = ActionType<typeof actions>;

const order = createReducer<OrderState, OrderAction>(initialState, {
    [SUBMIT_ORDER]: (state, { payload: order }) =>
        produce(state, (draft) => {
            draft.orders.push(order);
        }),
    [ADD_PRODUCT]: (state, { payload: product }) =>
        produce(state, (draft) => {
            draft.orderForm.products.push(product);
        }),
    [CHANGE_AMOUNT]: (state, { payload: { index, amount } }) =>
        produce(state, (draft) => {
            draft.orderForm.products[index].amount = amount;
        }),
    [REMOVE_PRODUCT]: (state, { payload: index }) =>
        produce(state, (draft) => {
            draft.orderForm.products.splice(index, 1);
        }),
});

export default order;
