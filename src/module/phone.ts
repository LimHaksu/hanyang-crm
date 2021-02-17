import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";

export interface PhoneCallRecord {
    idx: number;
    orderTime: string;
    cidMachineIdx: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    registerProduct: "작성" | "완료";
}

const ADD_PHONE_CALL_RECORD = "phone/ADD_PHONE_CALL_RECORD";

export const addPhoneCallRecordAction = createAction(
    ADD_PHONE_CALL_RECORD,
    (
        idx: number,
        orderTime: string,
        cidMachineIdx: number,
        customerName: string,
        phoneNumber: string,
        address: string,
        registerProduct: "작성" | "완료"
    ) => ({ idx, orderTime, cidMachineIdx, customerName, phoneNumber, address, registerProduct })
)();

const actions = { addPhoneCallRecordAction };

interface PhoneState {
    phoneCallRecords: PhoneCallRecord[];
}

const initialState: PhoneState = {
    phoneCallRecords: [],
};

type PhoneAction = ActionType<typeof actions>;

const phone = createReducer<PhoneState, PhoneAction>(initialState, {
    [ADD_PHONE_CALL_RECORD]: (state, { payload: phoneCallRecord }) =>
        produce(state, (draft) => {
            draft.phoneCallRecords.push(phoneCallRecord);
        }),
});

export default phone;
