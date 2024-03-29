import { call, put, takeLatest, takeEvery } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import { SearchBy, Customer, OrderByCustomer } from "module/customer";
import { getCustomers, addCustomer, editCustomer, removeCustomer, getCustomer, getOrdersByCustomer } from "db/customer";

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

export const AUTO_COMPLETE_CUSTOMER_ORDER_FORM = "customer/AUTO_COMPLETE_CUSTOMER_ORDER_FORM";
export const AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS = "customer/AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS";
export const AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR = "customer/AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR";

export const GET_ORDERS_BY_CUSTOMER = "customer/GET_ORDERS_BY_CUSTOMER";
export const GET_ORDERS_BY_CUSTOMER_SUCCESS = "customer/GET_ORDERS_BY_CUSTOMER_SUCCESS";
export const GET_ORDERS_BY_CUSTOMER_ERROR = "customer/GET_ORDERS_BY_CUSTOMER_ERROR";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const searchCustomersAsync = createAsyncAction(
    SEARCH_CUSTOMERS,
    SEARCH_CUSTOMERS_SUCCESS,
    SEARCH_CUSTOMERS_ERROR
)<
    { searchBy: SearchBy; keyword: string; startIndex: number; isAppendMode: boolean },
    { customers: Customer[]; isAppendMode: boolean },
    Error
>();

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

export const autoCompleteCustomerOrderFormAsync = createAsyncAction(
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM,
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS,
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR
)<{ searchBy: SearchBy; keyword: string }, Customer, Error>();

export const getOrdersByCustomerAsync = createAsyncAction(
    GET_ORDERS_BY_CUSTOMER,
    GET_ORDERS_BY_CUSTOMER_SUCCESS,
    GET_ORDERS_BY_CUSTOMER_ERROR
)<number, OrderByCustomer[], Error>();

function* searchCustomersSaga(action: ReturnType<typeof searchCustomersAsync.request>) {
    try {
        const { searchBy, keyword, startIndex, isAppendMode } = action.payload;
        const customers: Customer[] = yield call(getCustomers, { searchBy, keyword, startIndex });
        yield put(searchCustomersAsync.success({ customers, isAppendMode }));
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

function* autoCompleteCustomerOrderFormSaga(action: ReturnType<typeof autoCompleteCustomerOrderFormAsync.request>) {
    try {
        const [customer]: Customer[] = yield call(getCustomer, action.payload);
        yield put(autoCompleteCustomerOrderFormAsync.success(customer));
    } catch (e) {
        yield put(autoCompleteCustomerOrderFormAsync.failure(e));
    }
}

function* getOrdersByCustomerSaga(action: ReturnType<typeof getOrdersByCustomerAsync.request>) {
    try {
        const ordersByCustomer: OrderByCustomer[] = yield call(getOrdersByCustomer, action.payload);
        yield put(getOrdersByCustomerAsync.success(ordersByCustomer));
    } catch (e) {
        yield put(getOrdersByCustomerAsync.failure(e));
    }
}

export function* customerSaga() {
    yield takeLatest(SEARCH_CUSTOMERS, searchCustomersSaga);
    yield takeEvery(ADD_CUSTOMER, addCustomerSaga);
    yield takeEvery(EDIT_CUSTOMER, editCustomerSaga);
    yield takeEvery(REMOVE_CUSTOMER, removeCustomerSaga);
    yield takeEvery(AUTO_COMPLETE_CUSTOMER_ORDER_FORM, autoCompleteCustomerOrderFormSaga);
    yield takeEvery(GET_ORDERS_BY_CUSTOMER, getOrdersByCustomerSaga);
}
