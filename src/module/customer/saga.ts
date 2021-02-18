import { delay, call, put, takeEvery, takeLatest, select, throttle } from "redux-saga/effects";
import { createAction, createAsyncAction } from "typesafe-actions";
import createAsyncSaga from "util/createAsyncSaga";
import { SearchBy, Customer } from "module/customer";
import { getCustomers } from "db/customer";

export const SEARCH_CUSTOMERS = "customer/SEARCH_CUSTOMERS";
export const SEARCH_CUSTOMERS_SUCCESS = "customer/SEARCH_CUSTOMERS_SUCCESS";
export const SEARCH_CUSTOMERS_ERROR = "customer/SEARCH_CUSTOMERS_ERROR";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const searchCustomersAsync = createAsyncAction(
    SEARCH_CUSTOMERS,
    SEARCH_CUSTOMERS_SUCCESS,
    SEARCH_CUSTOMERS_ERROR
)<{ searchBy: SearchBy; keyword: string }, Customer[], Error>();

function* searchCustomersSaga(action: ReturnType<typeof searchCustomersAsync.request>) {
    try {
        const customers = yield call(getCustomers, action.payload);
        yield put(searchCustomersAsync.success(customers));
    } catch (e) {
        yield put(searchCustomersAsync.failure(e));
    }
}

export function* customerSaga() {
    yield takeLatest(SEARCH_CUSTOMERS, searchCustomersSaga);
}
