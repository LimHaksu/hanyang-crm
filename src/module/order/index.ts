import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { Product } from "module/product";

export type PaymentMethod = "현금" | "카드" | "선결제(배민)" | "선결제(요기요)" | "선결제(쿠팡)";

export interface Order {
    idx: number;
    customerIdx: number;
    orderTime: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    customerRequest: string;
    products: (Product & { amount: number })[];
    orderRequest: string;
    paymentMethod: PaymentMethod;
}

export interface OrderForm {
    idx: number;
    orderTime: number;
    products: (Product & { amount: number })[];
    orderRequest: string;
    paymentMethod: PaymentMethod;
}

const SET_ORDER_FORM = "order/SET_ORDER_FORM";

const ADD_PRODUCT = "order/ADD_PRODUCT";
const CHANGE_AMOUNT = "order/CHANGE_AMOUNT";
const REMOVE_PRODUCT = "order/REMOVE_AMOUNT";

const CHANGE_ORDER_REQUEST = "order/CHANGE_ORDER_REQUEST";
const CHANGE_PAYMENT_METHOD = "order/CAHGNE_PAYMENT_METHOD";

export const SUBMIT_ORDER = "order/SUBMIT_ORDER";
export const SUBMIT_ORDER_SUCCESS = "order/SUBMIT_ORDER_SUCCESS";
export const SUBMIT_ORDER_ERROR = "order/SUBMIT_ORDER_ERROR";

export const EDIT_ORDER = "order/EDIT_ORDER";
export const EDIT_ORDER_SUCCESS = "order/EDIT_ORDER_SUCCESS";
export const EDIT_ORDER_ERROR = "order/EDIT_ORDER_ERROR";

export const REMOVE_ORDER = "order/REMOVE_ORDER";
export const REMOVE_ORDER_SUCCESS = "order/REMOVE_ORDER_SUCCESS";
export const REMOVE_ORDER_ERROR = "order/REMOVE_ORDER_ERROR";

export const setOrderFormAction = createAction(SET_ORDER_FORM, (orderForm: OrderForm) => orderForm)();
export const addProductAction = createAction(ADD_PRODUCT, (product: Product & { amount: number }) => product)();
export const changeAmountAction = createAction(CHANGE_AMOUNT, (index: number, amount: number) => ({ index, amount }))();
export const removeProductAction = createAction(REMOVE_PRODUCT, (index: number) => index)();
export const changeOrderRequestAction = createAction(CHANGE_ORDER_REQUEST, (orderRequest: string) => orderRequest)();
export const changePaymentMethodAction = createAction(
    CHANGE_PAYMENT_METHOD,
    (paymentMethod: PaymentMethod) => paymentMethod
)();

export const submitOrderSuccess = createAction(SUBMIT_ORDER_SUCCESS)<Order>();
export const submitOrderError = createAction(SUBMIT_ORDER_ERROR)<Error>();

export const editOrderSuccess = createAction(EDIT_ORDER_SUCCESS)<Order>();
export const editOrderError = createAction(EDIT_ORDER_ERROR)<Error>();

export const removeOrderSuccess = createAction(REMOVE_ORDER_SUCCESS)<number>();
export const removeOrderError = createAction(REMOVE_ORDER_ERROR)<Error>();

const actions = {
    setOrderFormAction,
    addProductAction,
    changeAmountAction,
    removeProductAction,
    changeOrderRequestAction,
    changePaymentMethodAction,
    submitOrderSuccess,
    submitOrderError,
    editOrderSuccess,
    editOrderError,
    removeOrderSuccess,
    removeOrderError,
};

interface OrderState {
    orders: Order[];
    orderForm: OrderForm;
}

const initialState: OrderState = {
    orders: [
        {
            idx: 1,
            customerIdx: 1,
            orderTime: Date.now(),
            customerName: "홍길동",
            phoneNumber: "010-1234-5678",
            address: "목동 한사랑 108-906",
            customerRequest: "고객 요청사항 샘플",
            orderRequest: "주문 요청사항 생픔",
            paymentMethod: "현금",
            products: [
                { categoryIdx: 1, idx: 1, lexoRank: "aa", name: "족발", price: 2000, amount: 1 },
                { categoryIdx: 1, idx: 2, lexoRank: "ab", name: "보쌈", price: 3000, amount: 2 },
            ],
        },
    ],
    orderForm: {
        idx: -1,
        orderTime: -1,
        products: [],
        orderRequest: "",
        paymentMethod: "현금",
    },
};

type OrderAction = ActionType<typeof actions>;

const order = createReducer<OrderState, OrderAction>(initialState, {
    [SET_ORDER_FORM]: (state, { payload: orderForm }) => ({ ...state, orderForm }),
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
    [CHANGE_ORDER_REQUEST]: (state, { payload: orderRequest }) =>
        produce(state, (draft) => {
            draft.orderForm.orderRequest = orderRequest;
        }),
    [CHANGE_PAYMENT_METHOD]: (state, { payload: paymentMethod }) =>
        produce(state, (draft) => {
            draft.orderForm.paymentMethod = paymentMethod;
        }),

    [SUBMIT_ORDER_SUCCESS]: (state, { payload: order }) =>
        produce(state, (draft) => {
            draft.orders.push(order);
        }),
    [SUBMIT_ORDER_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
            console.error(error);
        }),

    [EDIT_ORDER_SUCCESS]: (state, { payload: order }) =>
        produce(state, (draft) => {
            const foundIndex = draft.orders.findIndex((o) => o.idx === order.idx);
            if (foundIndex >= 0) {
                draft.orders[foundIndex] = order;
            }
        }),
    [EDIT_ORDER_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),

    [REMOVE_ORDER_SUCCESS]: (state, { payload: orderIdx }) => ({
        ...state,
        orders: state.orders.filter((order) => order.idx !== orderIdx),
    }),
    [REMOVE_ORDER_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),
});

export default order;
