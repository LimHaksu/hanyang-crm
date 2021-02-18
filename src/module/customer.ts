import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";

export interface Customer {
    idx?: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request?: string;
}

export interface CustomerForm {
    idx?: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request?: string;
}

const ADD_CUSTOMER = "customer/ADD_CUSTOMER";
const EDIT_CUSTOMER = "customer/EDIT_CUSTOMER";
const REMOVE_CUSTOMER = "customer/REMOVE_CUSTOMER";

export const SET_CUSTOMER_ORDER_FORM = "customer/SET_CUSTOMER_ORDER_FORM";
export const SET_CUSTOMER_MANAGEMENT_FORM = "customer/SET_CUSTOMER_MANAGEMENT_FORM";
const SET_CUSTOMER_ORDER_FORM_EDIT_MODE = "customer/SET_CUSTOMER_ORDER_FORM_EDIT_MODE";
const SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE = "customer/SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE";

export const addCustomerAction = createAction(
    ADD_CUSTOMER,
    (customerName: string, phoneNumber: string, address: string, request?: string) => ({
        customerName,
        phoneNumber,
        address,
        request,
    })
)();

export const editCustomerAction = createAction(
    EDIT_CUSTOMER,
    (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request?: string) => ({
        idx,
        customerName,
        phoneNumber,
        address,
        request,
    })
)();

export const removeCustomerAction = createAction(REMOVE_CUSTOMER, (idx: number) => idx)();

export const setCustomerOrderFormAction = createAction(
    SET_CUSTOMER_ORDER_FORM,
    (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request?: string) => ({
        idx,
        customerName,
        phoneNumber,
        address,
        request,
    })
)();

export const setCustomerManagementFormAction = createAction(
    SET_CUSTOMER_MANAGEMENT_FORM,
    (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request?: string) => ({
        idx,
        customerName,
        phoneNumber,
        address,
        request,
    })
)();

export const setCustomerOrderFormEditModeAction = createAction(
    SET_CUSTOMER_ORDER_FORM_EDIT_MODE,
    (isEditMode: boolean) => isEditMode
)();

export const setCustomerManagementFormEditModeAction = createAction(
    SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE,
    (isEditMode: boolean) => isEditMode
)();

const actions = {
    addCustomerAction,
    editCustomerAction,
    removeCustomerAction,
    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
};

interface CustomerState {
    customers: Customer[];
    customerOrderForm: CustomerForm;
    customerManagementForm: CustomerForm;
    isCustomerOrderFormEditMode: boolean;
    isCustomerManagementFormEditMode: boolean;
}

const initialState: CustomerState = {
    customers: [
        { idx: 1, customerName: "손님1", phoneNumber: "010-1234-5678", address: "주소1", request: "안전한 배달" },
        { idx: 2, customerName: "손님2", phoneNumber: "02-1234-5678", address: "주소2", request: "수저X" },
    ],
    customerOrderForm: { customerName: "", address: "", phoneNumber: "", request: "" },
    customerManagementForm: { customerName: "", address: "", phoneNumber: "", request: "" },
    isCustomerOrderFormEditMode: false,
    isCustomerManagementFormEditMode: false,
};

type CustomerAction = ActionType<typeof actions>;

const customer = createReducer<CustomerState, CustomerAction>(initialState, {
    [ADD_CUSTOMER]: (state, { payload: customer }) =>
        produce(state, (draft) => {
            draft.customers.push(customer);
        }),
    [EDIT_CUSTOMER]: (state, { payload: customer }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.findIndex((c) => c.idx === customer.idx);
            if (foundIdx >= 0) {
                draft.customers[foundIdx] = customer;
            }
        }),
    [REMOVE_CUSTOMER]: (state, { payload: idx }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.findIndex((customer) => customer.idx === idx);
            draft.customers.splice(foundIdx, 1);
        }),
    [SET_CUSTOMER_ORDER_FORM]: (state, { payload: customerOrderForm }) => ({
        ...state,
        customerOrderForm,
    }),
    [SET_CUSTOMER_MANAGEMENT_FORM]: (state, { payload: customerManagementForm }) => ({
        ...state,
        customerManagementForm,
    }),
    [SET_CUSTOMER_ORDER_FORM_EDIT_MODE]: (state, { payload: isEditMode }) => ({
        ...state,
        isCustomerOrderFormEditMode: isEditMode,
    }),
    [SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE]: (state, { payload: isEditMode }) => ({
        ...state,
        isCustomerManagementFormEditMode: isEditMode,
    }),
});

export default customer;
