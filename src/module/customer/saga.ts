import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import { SearchBy, Customer } from "module/customer";
import { getCustomers, addCustomer, editCustomer, removeCustomer } from "db/customer";

export const SEARCH_CUSTOMERS = "customer/SEARCH_CUSTOMERS";
export const SEARCH_CUSTOMERS_SUCCESS = "customer/SEARCH_CUSTOMERS_SUCCESS";
export const SEARCH_CUSTOMERS_ERROR = "customer/SEARCH_CUSTOMERS_ERROR";

export const ADD_CUSTOMER = "customer/ADD_CUSTOMER";
export const ADD_CUSTOMER_SUCCESS = "customer/ADD_CUSTOMER_SUCCESS";
export const ADD_CUSTOMER_ERROR = "customer/ADD_CUSTOMER_ERROR";

export const EDIT_CUSTOMER = "customer/EDIT_CUSTOMER";
export const EDIT_CUSTOMER_SUCCESS = "customer/EDIT_CUSTOMER_SUCCESS";
export const EDIT_CUSTOMER_ERROR = "customer/EDIT_CUSTOMER_ERROR";

export const REMOVE_CUSTOMER = "customer/REMOVE_CUSTOMER";
export const REMOVE_CUSTOMER_SUCCESS = "customer/REMOVE_CUSTOMER_SUCCESS";
export const REMOVE_CUSTOMER_ERROR = "customer/REMOVE_CUSTOMER_ERROR";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const searchCustomersAsync = createAsyncAction(
    SEARCH_CUSTOMERS,
    SEARCH_CUSTOMERS_SUCCESS,
    SEARCH_CUSTOMERS_ERROR
)<{ searchBy: SearchBy; keyword: string }, Customer[], Error>();

export const addCustomerAsync = createAsyncAction(ADD_CUSTOMER, ADD_CUSTOMER_SUCCESS, ADD_CUSTOMER_ERROR)<
    {
        phoneNumber: string;
        name: string;
        address: string;
        request: string;
    },
    undefined,
    Error
>();

export const editCustomerAsync = createAsyncAction(EDIT_CUSTOMER, EDIT_CUSTOMER_SUCCESS, EDIT_CUSTOMER_ERROR)<
    {
        idx: number;
        phoneNumber: string;
        customerName: string;
        address: string;
        request: string;
    },
    {
        idx: number;
        phoneNumber: string;
        customerName: string;
        address: string;
        request: string;
    },
    Error
>();

export const removeCustomerAsync = createAsyncAction(REMOVE_CUSTOMER, REMOVE_CUSTOMER_SUCCESS, REMOVE_CUSTOMER_ERROR)<
    number,
    number,
    Error
>();

function* searchCustomersSaga(action: ReturnType<typeof searchCustomersAsync.request>) {
    try {
        const customers = yield call(getCustomers, action.payload);
        yield put(searchCustomersAsync.success(customers));
    } catch (e) {
        yield put(searchCustomersAsync.failure(e));
    }
}

function* addCustomerSaga(action: ReturnType<typeof addCustomerAsync.request>) {
    try {
        yield call(addCustomer, action.payload);
        yield put(addCustomerAsync.success());
    } catch (e) {
        yield put(addCustomerAsync.failure(e));
    }
}

function* editCustomerSaga(action: ReturnType<typeof editCustomerAsync.request>) {
    try {
        yield call(editCustomer, action.payload);
        yield put(editCustomerAsync.success(action.payload));
    } catch (e) {
        yield put(editCustomerAsync.failure(e));
    }
}

function* removeCustomerSaga(action: ReturnType<typeof removeCustomerAsync.request>) {
    try {
        yield call(removeCustomer, action.payload);
        yield put(removeCustomerAsync.success(action.payload));
    } catch (e) {
        yield put(removeCustomerAsync.failure(e));
    }
}

export function* customerSaga() {
    yield takeLatest(SEARCH_CUSTOMERS, searchCustomersSaga);
    yield takeEvery(ADD_CUSTOMER, addCustomerSaga);
    yield takeEvery(EDIT_CUSTOMER, editCustomerSaga);
    yield takeEvery(REMOVE_CUSTOMER, removeCustomerSaga);
}
