import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { HID as HIDType, Device } from "node-hid";
import { getValidDeviceName } from "util/cid/device";
const HID = window.require("node-hid");

export interface PhoneCallRecord {
    idx: number;
    orderTime: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    registerProduct: "작성" | "완료";
}

export interface RegisteredPhoneDevice {
    device: Device;
    hid: HIDType;
}

const ADD_PHONE_CALL_RECORD = "phone/ADD_PHONE_CALL_RECORD";
const SET_REGISTERED_PHONE_DEVICES = "phone/SET_REGISTERED_PHONE_DEVICES";

export const addPhoneCallRecordAction = createAction(
    ADD_PHONE_CALL_RECORD,
    (
        idx: number,
        orderTime: string,
        customerName: string,
        phoneNumber: string,
        address: string,
        registerProduct: "작성" | "완료"
    ) => ({ idx, orderTime, customerName, phoneNumber, address, registerProduct })
)();

export const setRegiteredPhoneDevicesAction = createAction(
    SET_REGISTERED_PHONE_DEVICES,
    (selectedDevices: Device[]) => selectedDevices
)();

const actions = { addPhoneCallRecordAction, setRegiteredPhoneDevicesAction };

interface PhoneState {
    phoneCallRecords: PhoneCallRecord[];
    registeredPhoneDevices: RegisteredPhoneDevice[];
}

const initialState: PhoneState = {
    phoneCallRecords: [],
    registeredPhoneDevices: [],
};

type PhoneAction = ActionType<typeof actions>;

const phone = createReducer<PhoneState, PhoneAction>(initialState, {
    [ADD_PHONE_CALL_RECORD]: (state, { payload: phoneCallRecord }) =>
        produce(state, (draft) => {
            draft.phoneCallRecords.push(phoneCallRecord);
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
});

export default phone;
