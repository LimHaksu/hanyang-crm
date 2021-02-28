import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { Product } from "module/product";
import { getTimeMinusOpeningHour } from "util/time";

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
    phoneCallRecordIdx: number;
    oldAddress?: string;
    oldProductsNames?: string;
    oldPrice?: string;
}

export interface OrderForm {
    idx: number;
    orderTime: number;
    products: (Product & { amount: number })[];
    orderRequest: string;
    paymentMethod: PaymentMethod;
    phoneCallRecordIdx: number;
    oldProductsNames?: string;
    oldPrice?: number;
}

export const GET_ORDERS = "order/GET_ORDERS";
export const GET_ORDERS_SUCCESS = "order/GET_ORDERS_SUCCESS";
export const GET_ORDERS_ERROR = "order/GET_ORDERS_ERROR";

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

const SET_SELECTED_DATE = "order/SET_SELECTED_DATE";
const SET_ORDER_EDIT_MODE = "order/SET_ORDER_EDIT_MODE";
const SET_IS_ORDER_ASC = "order/SET_IS_ORDER_ASC";

export const setOrderFormAction = createAction(SET_ORDER_FORM, (orderForm: OrderForm) => orderForm)();
export const addProductAction = createAction(ADD_PRODUCT, (product: Product & { amount: number }) => product)();
export const changeAmountAction = createAction(CHANGE_AMOUNT, (index: number, amount: number) => ({ index, amount }))();
export const removeProductAction = createAction(REMOVE_PRODUCT, (index: number) => index)();
export const changeOrderRequestAction = createAction(CHANGE_ORDER_REQUEST, (orderRequest: string) => orderRequest)();
export const changePaymentMethodAction = createAction(
    CHANGE_PAYMENT_METHOD,
    (paymentMethod: PaymentMethod) => paymentMethod
)();

const getOrdersSuccess = createAction(GET_ORDERS_SUCCESS)<Order[]>();
const getOrdersError = createAction(GET_ORDERS_ERROR)<Error>();

const submitOrderSuccess = createAction(SUBMIT_ORDER_SUCCESS)<Order>();
const submitOrderError = createAction(SUBMIT_ORDER_ERROR)<Error>();

const editOrderSuccess = createAction(EDIT_ORDER_SUCCESS)<Order>();
const editOrderError = createAction(EDIT_ORDER_ERROR)<Error>();

const removeOrderSuccess = createAction(REMOVE_ORDER_SUCCESS)<number>();
const removeOrderError = createAction(REMOVE_ORDER_ERROR)<Error>();

export const setSelectedDateAction = createAction(SET_SELECTED_DATE, (selectedDate: Date | null) => selectedDate)();
export const setOrderEditModeAction = createAction(SET_ORDER_EDIT_MODE, (isEditMode: boolean) => isEditMode)();
export const setIsOrderAscAction = createAction(SET_IS_ORDER_ASC, (isOrderAsc: boolean) => isOrderAsc)();

const actions = {
    setOrderFormAction,
    addProductAction,
    changeAmountAction,
    removeProductAction,
    changeOrderRequestAction,
    changePaymentMethodAction,
    getOrdersSuccess,
    getOrdersError,
    submitOrderSuccess,
    submitOrderError,
    editOrderSuccess,
    editOrderError,
    removeOrderSuccess,
    removeOrderError,
    setSelectedDateAction,
    setOrderEditModeAction,
    setIsOrderAscAction,
};

interface OrderState {
    selectedDate: Date | null;
    orders: Order[];
    isOrderAsc: boolean;
    orderForm: OrderForm;
    isOrderEditMode: boolean;
}

const initialState: OrderState = {
    selectedDate: new Date(getTimeMinusOpeningHour(Date.now())),
    orders: [],
    isOrderAsc: true,
    orderForm: {
        idx: -1,
        orderTime: -1,
        products: [],
        orderRequest: "",
        paymentMethod: "현금",
        phoneCallRecordIdx: -1,
        oldProductsNames: "",
        oldPrice: -1,
    },
    isOrderEditMode: false,
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

    [GET_ORDERS_SUCCESS]: (state, { payload: orders }) => ({
        ...state,
        orders,
    }),

    [GET_ORDERS_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),

    [SUBMIT_ORDER_SUCCESS]: (state, { payload: order }) =>
        produce(state, (draft) => {
            draft.orders.push(order);
        }),
    [SUBMIT_ORDER_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
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

    [SET_SELECTED_DATE]: (state, { payload: selectedDate }) => ({ ...state, selectedDate }),
    [SET_ORDER_EDIT_MODE]: (state, { payload: isOrderEditMode }) => ({ ...state, isOrderEditMode }),
    [SET_IS_ORDER_ASC]: (state, { payload: isOrderAsc }) => {
        localStorage.setItem("isOrderAsc", JSON.stringify(isOrderAsc));
        return { ...state, isOrderAsc };
    },
});

export default order;
