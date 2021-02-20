import { call, put, takeEvery } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import {
    SUBMIT_ORDER,
    SUBMIT_ORDER_SUCCESS,
    SUBMIT_ORDER_ERROR,
    REMOVE_ORDER,
    REMOVE_ORDER_SUCCESS,
    REMOVE_ORDER_ERROR,
} from "./index";
import { Order } from "module/order";
import { addOrder, removeOrder } from "db/order";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌

export const submitOrderAsync = createAsyncAction(SUBMIT_ORDER, SUBMIT_ORDER_SUCCESS, SUBMIT_ORDER_ERROR)<
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
        yield call(addOrder, action.payload);
        yield put(submitOrderAsync.success(action.payload));
    } catch (e) {
        yield put(submitOrderAsync.failure(e));
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
    yield takeEvery(REMOVE_ORDER, removeOrderSaga);
}
