import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import {
    GET_PHONE_CALL_RECORDS,
    GET_PHONE_CALL_RECORDS_SUCCESS,
    GET_PHONE_CALL_RECORDS_ERROR,
    ADD_PHONE_CALL_RECORD,
    ADD_PHONE_CALL_RECORD_SUCCESS,
    ADD_PHONE_CALL_RECORD_ERROR,
    REMOVE_PHONE_CALL_RECORD,
    REMOVE_PHONE_CALL_RECORD_SUCCESS,
    REMOVE_PHONE_CALL_RECORD_ERROR,
} from "./index";
import { PhoneCallRecord } from "module/phone";
import { getPhoneCallRecords, addPhoneCallRecord, removePhoneCallRecord } from "db/phone";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const getPhoneCallRecordsAsync = createAsyncAction(
    GET_PHONE_CALL_RECORDS,
    GET_PHONE_CALL_RECORDS_SUCCESS,
    GET_PHONE_CALL_RECORDS_ERROR
)<{ year: number; month: number; date: number }, PhoneCallRecord[], Error>();

export const addPhoneCallRecordAsync = createAsyncAction(
    ADD_PHONE_CALL_RECORD,
    ADD_PHONE_CALL_RECORD_SUCCESS,
    ADD_PHONE_CALL_RECORD_ERROR
)<Omit<PhoneCallRecord, "idx" | "orderIdx">, PhoneCallRecord, Error>();

export const removePhoneCallRecordAsync = createAsyncAction(
    REMOVE_PHONE_CALL_RECORD,
    REMOVE_PHONE_CALL_RECORD_SUCCESS,
    REMOVE_PHONE_CALL_RECORD_ERROR
)<number, number, Error>();

function* getPhoneCallRecordsSaga(action: ReturnType<typeof getPhoneCallRecordsAsync.request>) {
    try {
        const { year, month, date } = action.payload;
        const phoneCallRecords = yield call(getPhoneCallRecords, year, month, date);
        yield put(getPhoneCallRecordsAsync.success(phoneCallRecords));
    } catch (e) {
        yield put(getPhoneCallRecordsAsync.failure(e));
    }
}

function* addPhoneCallRecordSaga(action: ReturnType<typeof addPhoneCallRecordAsync.request>) {
    try {
        const { receivedDatetime, customerName, phoneNumber, address, request } = action.payload;
        const lastIdx = yield call(addPhoneCallRecord, receivedDatetime, customerName, phoneNumber, address, request);
        yield put(addPhoneCallRecordAsync.success({ ...action.payload, idx: lastIdx }));
    } catch (e) {
        yield put(addPhoneCallRecordAsync.failure(e));
    }
}

function* removePhoneCallRecordSaga(action: ReturnType<typeof removePhoneCallRecordAsync.request>) {
    try {
        yield call(removePhoneCallRecord, action.payload);
        yield put(removePhoneCallRecordAsync.success(action.payload));
    } catch (e) {
        yield put(removePhoneCallRecordAsync.failure(e));
    }
}

export function* phoneSaga() {
    yield takeLatest(GET_PHONE_CALL_RECORDS, getPhoneCallRecordsSaga);
    yield takeEvery(ADD_PHONE_CALL_RECORD, addPhoneCallRecordSaga);
    yield takeEvery(REMOVE_PHONE_CALL_RECORD, removePhoneCallRecordSaga);
}
