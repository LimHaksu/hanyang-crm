import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import {
    SEARCH_CUSTOMERS,
    SEARCH_CUSTOMERS_SUCCESS,
    SEARCH_CUSTOMERS_ERROR,
    ADD_CUSTOMER,
    ADD_CUSTOMER_SUCCESS,
    ADD_CUSTOMER_ERROR,
    EDIT_CUSTOMER,
    EDIT_CUSTOMER_SUCCESS,
    EDIT_CUSTOMER_ERROR,
    REMOVE_CUSTOMER,
    REMOVE_CUSTOMER_SUCCESS,
    REMOVE_CUSTOMER_ERROR,
} from "./saga";

export type SearchBy = "name" | "phoneNumber" | "address";

export interface Customer {
    idx?: number;
    name?: string;
    customerName: string;
    phoneNumber: string;
    address: string;
    request: string;
}

export interface CustomerForm {
    idx?: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request: string;
}

export const SET_CUSTOMER_ORDER_FORM = "customer/SET_CUSTOMER_ORDER_FORM";
export const SET_CUSTOMER_MANAGEMENT_FORM = "customer/SET_CUSTOMER_MANAGEMENT_FORM";
const SET_CUSTOMER_ORDER_FORM_EDIT_MODE = "customer/SET_CUSTOMER_ORDER_FORM_EDIT_MODE";
const SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE = "customer/SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE";

export const searchCustomers = createAction(SEARCH_CUSTOMERS)();
export const searchCustomersSuccess = createAction(SEARCH_CUSTOMERS_SUCCESS)<Customer[]>();
export const searchCustomersError = createAction(SEARCH_CUSTOMERS_ERROR)<Error>();

export const addCustomer = createAction(ADD_CUSTOMER)();
export const addCustomerSuccess = createAction(ADD_CUSTOMER_SUCCESS)();
export const addCustomerError = createAction(ADD_CUSTOMER_ERROR)<Error>();

export const editCustomer = createAction(EDIT_CUSTOMER)();
export const editCustomerSuccess = createAction(EDIT_CUSTOMER_SUCCESS)<Customer>();
export const editCustomerError = createAction(EDIT_CUSTOMER_ERROR)<Error>();

export const removeCustomer = createAction(REMOVE_CUSTOMER)();
export const removeCustomerSuccess = createAction(REMOVE_CUSTOMER_SUCCESS)<number>();
export const removeCustomerError = createAction(REMOVE_CUSTOMER_ERROR)<Error>();

export const setCustomerOrderFormAction = createAction(
    SET_CUSTOMER_ORDER_FORM,
    (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request: string) => ({
        idx,
        customerName,
        phoneNumber,
        address,
        request,
    })
)();

export const setCustomerManagementFormAction = createAction(
    SET_CUSTOMER_MANAGEMENT_FORM,
    (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request: string) => ({
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
    searchCustomers,
    searchCustomersSuccess,
    searchCustomersError,

    addCustomer,
    addCustomerSuccess,
    addCustomerError,

    editCustomer,
    editCustomerSuccess,
    editCustomerError,

    removeCustomer,
    removeCustomerSuccess,
    removeCustomerError,

    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
};

interface CustomerState {
    customers: { loading: boolean; error: Error | null; data: Customer[] };
    customerOrderForm: CustomerForm;
    customerManagementForm: CustomerForm;
    isCustomerOrderFormEditMode: boolean;
    isCustomerManagementFormEditMode: boolean;
    addState: { loading: boolean; error: Error | null };
    editState: { loading: boolean; error: Error | null };
    removeState: { loading: boolean; error: Error | null };
}

const initialState: CustomerState = {
    customers: {
        loading: false,
        error: null,
        data: [
            { idx: 1, customerName: "손님1", phoneNumber: "010-1234-5678", address: "주소1", request: "안전한 배달" },
            { idx: 2, customerName: "손님2", phoneNumber: "02-1234-5678", address: "주소2", request: "수저X" },
        ],
    },
    customerOrderForm: { customerName: "", address: "", phoneNumber: "", request: "" },
    customerManagementForm: { customerName: "", address: "", phoneNumber: "", request: "" },
    isCustomerOrderFormEditMode: false,
    isCustomerManagementFormEditMode: false,
    addState: { loading: false, error: null },
    editState: { loading: false, error: null },
    removeState: { loading: false, error: null },
};

type CustomerAction = ActionType<typeof actions>;

const customer = createReducer<CustomerState, CustomerAction>(initialState, {
    [SEARCH_CUSTOMERS]: (state) => ({ ...state, customers: { loading: true, error: null, data: [] } }),
    [SEARCH_CUSTOMERS_SUCCESS]: (state, { payload: searchResults }) => ({
        ...state,
        customers: {
            loading: false,
            error: null,
            data: searchResults.map((row) => ({ ...row, customerName: row.name! })),
        },
    }),
    [SEARCH_CUSTOMERS_ERROR]: (state, { payload: searchResults }) => ({
        ...state,
        customers: {
            loading: false,
            error: searchResults,
            data: [],
        },
    }),

    [ADD_CUSTOMER]: (state) => ({ ...state, addState: { loading: true, error: null } }),
    [ADD_CUSTOMER_SUCCESS]: (state) => ({ ...state, addState: { loading: false, error: null } }),
    [ADD_CUSTOMER_ERROR]: (state, { payload: error }) => ({ ...state, addState: { loading: false, error } }),

    [EDIT_CUSTOMER]: (state) => ({ ...state, editState: { loading: true, error: null } }),
    [EDIT_CUSTOMER_SUCCESS]: (state, { payload: customer }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.data?.findIndex((c) => c.idx === customer.idx);
            if (foundIdx && foundIdx >= 0) {
                draft.customers.data![foundIdx] = customer;
            }
            draft.editState.loading = false;
        }),
    [EDIT_CUSTOMER_ERROR]: (state, { payload: error }) => ({ ...state, editState: { loading: false, error } }),

    [REMOVE_CUSTOMER]: (state) => ({ ...state, removeState: { loading: true, error: null } }),
    [REMOVE_CUSTOMER_SUCCESS]: (state, { payload: idx }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.data?.findIndex((customer) => customer.idx === idx);
            draft.customers.data?.splice(foundIdx!, 1);
            draft.removeState.loading = false;
        }),
    [REMOVE_CUSTOMER_ERROR]: (state, { payload: error }) => ({ ...state, removeState: { loading: false, error } }),

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
