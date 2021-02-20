import { call, put, takeEvery } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import {
    SUBMIT_ORDER,
    SUBMIT_ORDER_SUCCESS,
    SUBMIT_ORDER_ERROR,
    EDIT_ORDER,
    EDIT_ORDER_SUCCESS,
    EDIT_ORDER_ERROR,
    REMOVE_ORDER,
    REMOVE_ORDER_SUCCESS,
    REMOVE_ORDER_ERROR,
} from "./index";
import { Order } from "module/order";
import { getOrderByIdx, addOrder, editOrder, removeOrder } from "db/order";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌

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

function* submitOrderSaga(action: ReturnType<typeof submitOrderAsync.request>) {
    try {
        const orderIdx = yield call(addOrder, action.payload);
        const order = yield call(getOrderByIdx, orderIdx);
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

export function* orderSaga() {
    yield takeEvery(SUBMIT_ORDER, submitOrderSaga);
    yield takeEvery(EDIT_ORDER, editOrderSaga);
    yield takeEvery(REMOVE_ORDER, removeOrderSaga);
}
