import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import {
    GET_ORDERS,
    GET_ORDERS_SUCCESS,
    GET_ORDERS_ERROR,
    SUBMIT_ORDER,
    SUBMIT_ORDER_SUCCESS,
    SUBMIT_ORDER_ERROR,
    EDIT_ORDER,
    EDIT_ORDER_SUCCESS,
    EDIT_ORDER_ERROR,
    REMOVE_ORDER,
    REMOVE_ORDER_SUCCESS,
    REMOVE_ORDER_ERROR,
    SET_FIRST_ORDER_DATE,
    SET_FIRST_ORDER_DATE_SUCCESS,
    SET_FIRST_ORDER_DATE_ERROR,
} from "./index";
import { Order } from "module/order";
import {
    getOrderByIdx,
    addOrder,
    editOrder,
    removeOrder,
    getOrdersByYearMonthDate,
    getFirstOrderDatetime,
} from "db/order";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const getOrdersAsync = createAsyncAction(GET_ORDERS, GET_ORDERS_SUCCESS, GET_ORDERS_ERROR)<
    { year: number; month: number; date: number },
    Order[],
    Error
>();

export const submitOrderAsync = createAsyncAction(SUBMIT_ORDER, SUBMIT_ORDER_SUCCESS, SUBMIT_ORDER_ERROR)<
    Omit<Order, "idx" | "customerIdx" | "orderTime">,
    Order,
    Error
>();

export const editOrderAsync = createAsyncAction(EDIT_ORDER, EDIT_ORDER_SUCCESS, EDIT_ORDER_ERROR)<
    Order,
    Order,
    Error
>();

export const removeOrderAsync = createAsyncAction(REMOVE_ORDER, REMOVE_ORDER_SUCCESS, REMOVE_ORDER_ERROR)<
    number,
    number,
    Error
>();

export const setFirstOrderDateAsync = createAsyncAction(
    SET_FIRST_ORDER_DATE,
    SET_FIRST_ORDER_DATE_SUCCESS,
    SET_FIRST_ORDER_DATE_ERROR
)<undefined, { year: number; month: number; date: number }, Error>();

function* getOrdersSaga(action: ReturnType<typeof getOrdersAsync.request>) {
    try {
        const { year, month, date } = action.payload;
        const orders: Order[] = yield call(getOrdersByYearMonthDate, year, month, date);
        yield put(getOrdersAsync.success(orders));
    } catch (e) {
        yield put(getOrdersAsync.failure(e));
    }
}

function* submitOrderSaga(action: ReturnType<typeof submitOrderAsync.request>) {
    try {
        const orderIdx: number = yield call(addOrder, action.payload);
        const order: Order = yield call(getOrderByIdx, orderIdx);
        yield put(submitOrderAsync.success(order));
    } catch (e) {
        yield put(submitOrderAsync.failure(e));
    }
}

function* editOrderSaga(action: ReturnType<typeof editOrderAsync.request>) {
    try {
        yield call(editOrder, action.payload);
        yield put(editOrderAsync.success(action.payload));
    } catch (e) {
        yield put(editOrderAsync.failure(e));
    }
}

function* removeOrderSaga(action: ReturnType<typeof removeOrderAsync.request>) {
    try {
        yield call(removeOrder, action.payload);
        yield put(removeOrderAsync.success(action.payload));
    } catch (e) {
        yield put(removeOrderAsync.failure(e));
    }
}

function* setFirstOrderDateSage() {
    try {
        const { orderDatetime } = yield call(getFirstOrderDatetime);
        const dateObj = new Date(orderDatetime);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const date = dateObj.getDate();
        const firstOrderDate = {
            year,
            month,
            date,
        };
        yield put(setFirstOrderDateAsync.success(firstOrderDate));
    } catch (e) {
        yield put(setFirstOrderDateAsync.failure(e));
    }
}

export function* orderSaga() {
    yield takeLatest(GET_ORDERS, getOrdersSaga);
    yield takeEvery(SUBMIT_ORDER, submitOrderSaga);
    yield takeEvery(EDIT_ORDER, editOrderSaga);
    yield takeEvery(REMOVE_ORDER, removeOrderSaga);
    yield takeLatest(SET_FIRST_ORDER_DATE, setFirstOrderDateSage);
}
