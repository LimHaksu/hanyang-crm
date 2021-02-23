import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { HID as HIDType, Device } from "node-hid";
import { getValidDeviceName } from "util/cid/device";
import { getTimeMinusOpeningHour } from "util/time";

const HID = window.require("node-hid");

export interface PhoneCallRecord {
    idx: number;
    receivedDatetime: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request: string;
    orderIdx?: number;
}

export interface RegisteredPhoneDevice {
    device: Device;
    hid: HIDType;
}

export const GET_PHONE_CALL_RECORDS = "phone/GET_PHONE_CALL_RECORDS";
export const GET_PHONE_CALL_RECORDS_SUCCESS = "phone/GET_PHONE_CALL_RECORDS_SUCCESS";
export const GET_PHONE_CALL_RECORDS_ERROR = "phone/GET_PHONE_CALL_RECORDS_ERROR";

export const ADD_PHONE_CALL_RECORD = "phone/ADD_PHONE_CALL_RECORD";
export const ADD_PHONE_CALL_RECORD_SUCCESS = "phone/ADD_PHONE_CALL_RECORD_SUCCESS";
export const ADD_PHONE_CALL_RECORD_ERROR = "phone/ADD_PHONE_CALL_RECORD_ERROR";

export const APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD = "phone/APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD";
export const APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_SUCCESS = "phone/APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_SUCCESS";
export const APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_ERROR = "phone/APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_ERROR";

const SET_SELECTED_DATE = "phone/SET_SELECTED_DATE";
const SET_REGISTERED_PHONE_DEVICES = "phone/SET_REGISTERED_PHONE_DEVICES";

const getPhoneCallRecordsSuccess = createAction(GET_PHONE_CALL_RECORDS_SUCCESS)<PhoneCallRecord[]>();
const getPhoneCallRecordsError = createAction(GET_PHONE_CALL_RECORDS_ERROR)<Error>();

const addPhoneCallRecordSuccess = createAction(ADD_PHONE_CALL_RECORD_SUCCESS)<PhoneCallRecord>();
const addPhoneCallRecordError = createAction(ADD_PHONE_CALL_RECORD_ERROR)<Error>();

const appendOrderIdxToPhoneCallRecordSuccess = createAction(APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_SUCCESS)<{
    phoneCallRecordIdx: number;
    orderIdx: number;
}>();
const appendOrderIdxToPhoneCallRecordError = createAction(APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_ERROR)<Error>();

export const setSelectedDateAction = createAction(SET_SELECTED_DATE, (selectedDate: Date | null) => selectedDate)();
export const setRegiteredPhoneDevicesAction = createAction(
    SET_REGISTERED_PHONE_DEVICES,
    (selectedDevices: Device[]) => selectedDevices
)();

const actions = {
    getPhoneCallRecordsSuccess,
    getPhoneCallRecordsError,
    setRegiteredPhoneDevicesAction,
    addPhoneCallRecordSuccess,
    addPhoneCallRecordError,
    appendOrderIdxToPhoneCallRecordSuccess,
    appendOrderIdxToPhoneCallRecordError,
    setSelectedDateAction,
};

interface PhoneState {
    selectedDate: Date | null;
    phoneCallRecords: PhoneCallRecord[];
    registeredPhoneDevices: RegisteredPhoneDevice[];
}

const initialState: PhoneState = {
    selectedDate: new Date(getTimeMinusOpeningHour(Date.now())),
    phoneCallRecords: [],
    registeredPhoneDevices: [],
};

type PhoneAction = ActionType<typeof actions>;

const phone = createReducer<PhoneState, PhoneAction>(initialState, {
    [GET_PHONE_CALL_RECORDS_SUCCESS]: (state, { payload: phoneCallRecords }) => ({
        ...state,
        phoneCallRecords,
    }),
    [GET_PHONE_CALL_RECORDS_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),
    [ADD_PHONE_CALL_RECORD_SUCCESS]: (state, { payload: phoneCallRecord }) =>
        produce(state, (draft) => {
            draft.phoneCallRecords.push(phoneCallRecord);
        }),
    [ADD_PHONE_CALL_RECORD_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),
    [APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_SUCCESS]: (state, { payload: { orderIdx, phoneCallRecordIdx } }) =>
        produce(state, (draft) => {
            const foundRecord = draft.phoneCallRecords.find((record) => record.idx === phoneCallRecordIdx);
            if (foundRecord) {
                foundRecord.orderIdx = orderIdx;
            }
        }),
    [APPEND_ORDER_IDX_TO_PHONE_CALL_RECORD_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),

    [SET_REGISTERED_PHONE_DEVICES]: (state, { payload: selectedDevices }) =>
        produce(state, (draft) => {
            draft.registeredPhoneDevices.forEach((device) => {
                // 기존 device 연결 해제
                device.hid.close();
            });
            draft.registeredPhoneDevices = selectedDevices.map((device) => ({
                device: { ...device, product: getValidDeviceName(device) },
                hid: new HID.HID(device.path!),
            }));
        }),
    [SET_SELECTED_DATE]: (state, { payload: selectedDate }) => ({ ...state, selectedDate }),
});

export default phone;
