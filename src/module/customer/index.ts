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
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM,
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS,
    AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR,
} from "./saga";

export type SearchBy = "name" | "phoneNumber" | "address";

export interface Customer {
    idx: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request: string;
}

export interface CustomerForm {
    idx: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    request: string;
}

export const SET_CUSTOMER_ORDER_FORM = "customer/SET_CUSTOMER_ORDER_FORM";
export const SET_CUSTOMER_MANAGEMENT_FORM = "customer/SET_CUSTOMER_MANAGEMENT_FORM";
const SET_CUSTOMER_ORDER_FORM_EDIT_MODE = "customer/SET_CUSTOMER_ORDER_FORM_EDIT_MODE";
const SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE = "customer/SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE";
const SET_ADD_SUCCESS = "customer/SET_ADD_SUCCESS";
const SET_EDIT_SUCCESS = "customer/SET_EDIT_SUCCESS";
const SET_REMOVE_SUCCESS = "customer/SET_REMOVE_SUCCESS";
const SET_SEARCH_INFO = "customer/SET_SEARCH_INFO";
const SET_IS_SEARCHING_NOW = "customer/SET_IS_SEARCHING_NOW";
const RESET_ERROR_MESSAGE = "customer/RESET_ERROR_MESSAGE";

const searchCustomers = createAction(SEARCH_CUSTOMERS)();
const searchCustomersSuccess = createAction(SEARCH_CUSTOMERS_SUCCESS)<{
    customers: Customer[];
    isAppendMode: boolean;
}>();
const searchCustomersError = createAction(SEARCH_CUSTOMERS_ERROR)<Error>();

const addCustomer = createAction(ADD_CUSTOMER)();
const addCustomerSuccess = createAction(ADD_CUSTOMER_SUCCESS)();
const addCustomerError = createAction(ADD_CUSTOMER_ERROR)<Error>();

const editCustomer = createAction(EDIT_CUSTOMER)();
const editCustomerSuccess = createAction(EDIT_CUSTOMER_SUCCESS)<Customer>();
const editCustomerError = createAction(EDIT_CUSTOMER_ERROR)<Error>();

const removeCustomer = createAction(REMOVE_CUSTOMER)();
const removeCustomerSuccess = createAction(REMOVE_CUSTOMER_SUCCESS)<number>();
const removeCustomerError = createAction(REMOVE_CUSTOMER_ERROR)<Error>();

const autoCompleteCustomerOrderForm = createAction(AUTO_COMPLETE_CUSTOMER_ORDER_FORM)();
const autoCompleteCustomerOrderFormSuccess = createAction(AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS)<Customer>();
const autoCompleteCustomerOrderFormError = createAction(AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR)<Error>();

export const setCustomerOrderFormAction = createAction(
    SET_CUSTOMER_ORDER_FORM,
    (customerOrderForm: CustomerForm) => customerOrderForm
)();

export const setCustomerManagementFormAction = createAction(
    SET_CUSTOMER_MANAGEMENT_FORM,
    (customerManagementForm: CustomerForm) => customerManagementForm
)();

export const setCustomerOrderFormEditModeAction = createAction(
    SET_CUSTOMER_ORDER_FORM_EDIT_MODE,
    (isEditMode: boolean) => isEditMode
)();

export const setCustomerManagementFormEditModeAction = createAction(
    SET_CUSTOMER_MANAGEMENT_FORM_EDIT_MODE,
    (isEditMode: boolean) => isEditMode
)();

export const setAddSuccessAction = createAction(
    SET_ADD_SUCCESS,
    (isAddCustomerSuccess: boolean) => isAddCustomerSuccess
)();
export const setEditSuccessAction = createAction(
    SET_EDIT_SUCCESS,
    (isEditCustomerSuccess: boolean) => isEditCustomerSuccess
)();
export const setRemoveSuccessAction = createAction(
    SET_REMOVE_SUCCESS,
    (isRemoveCustomerSuccess: boolean) => isRemoveCustomerSuccess
)();

export const resetErrorMessageAction = createAction(RESET_ERROR_MESSAGE)<void>();

export const setSearchInfoAction = createAction(SET_SEARCH_INFO)<{ searchBy: SearchBy; keyword: string }>();
export const setIsSearchingNowAction = createAction(SET_IS_SEARCHING_NOW)<boolean>();

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
    setAddSuccessAction,
    setEditSuccessAction,
    setRemoveSuccessAction,
    setSearchInfoAction,
    setIsSearchingNowAction,
    resetErrorMessageAction,

    autoCompleteCustomerOrderForm,
    autoCompleteCustomerOrderFormSuccess,
    autoCompleteCustomerOrderFormError,
};

interface CustomerState {
    customers: { loading: boolean; error: Error | null; data: Customer[] };
    customerOrderForm: CustomerForm;
    customerManagementForm: CustomerForm;
    isCustomerOrderFormEditMode: boolean;
    isCustomerManagementFormEditMode: boolean;
    addState: { loading: boolean; error: Error | null; isSuccess: boolean };
    editState: { loading: boolean; error: Error | null; isSuccess: boolean };
    removeState: { loading: boolean; error: Error | null; isSuccess: boolean };
    searchInfo: { searchBy: SearchBy; keyword: string };
    isSearchingNow: boolean;
    errorMessage: string | null;
}

const initialState: CustomerState = {
    customers: {
        loading: false,
        error: null,
        data: [],
    },
    customerOrderForm: { idx: -1, customerName: "", address: "", phoneNumber: "", request: "" },
    customerManagementForm: { idx: -1, customerName: "", address: "", phoneNumber: "", request: "" },
    isCustomerOrderFormEditMode: false,
    isCustomerManagementFormEditMode: false,
    addState: { loading: false, error: null, isSuccess: false },
    editState: { loading: false, error: null, isSuccess: false },
    removeState: { loading: false, error: null, isSuccess: false },
    searchInfo: { searchBy: "name", keyword: "" },
    isSearchingNow: false,
    errorMessage: null,
};

type CustomerAction = ActionType<typeof actions>;

const customer = createReducer<CustomerState, CustomerAction>(initialState, {
    [SEARCH_CUSTOMERS]: (state) => ({
        ...state,
        customers: { ...state.customers, loading: true, error: null },
    }),
    [SEARCH_CUSTOMERS_SUCCESS]: (state, { payload: { customers, isAppendMode } }) => ({
        ...state,
        customers: {
            loading: false,
            error: null,
            data: isAppendMode ? [...state.customers.data, ...customers] : customers,
        },
        isSearchingNow: false,
    }),
    [SEARCH_CUSTOMERS_ERROR]: (state, { payload: error }) => ({
        ...state,
        customers: {
            ...state.customers,
            loading: false,
            error,
        },
    }),

    [ADD_CUSTOMER]: (state) => ({ ...state, addState: { loading: true, error: null, isSuccess: false } }),
    [ADD_CUSTOMER_SUCCESS]: (state) => ({ ...state, addState: { loading: false, error: null, isSuccess: true } }),
    [ADD_CUSTOMER_ERROR]: (state, { payload: error }) => ({
        ...state,
        addState: { loading: false, error, isSuccess: false },
    }),

    [EDIT_CUSTOMER]: (state) => ({ ...state, editState: { loading: true, error: null, isSuccess: false } }),
    [EDIT_CUSTOMER_SUCCESS]: (state, { payload: customer }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.data.findIndex((c) => c.idx === customer.idx);
            if (foundIdx >= 0) {
                draft.customers.data[foundIdx] = customer;
            }
            draft.editState.loading = false;
            draft.editState.isSuccess = true;
        }),
    [EDIT_CUSTOMER_ERROR]: (state, { payload: error }) => ({
        ...state,
        editState: { loading: false, error, isSuccess: false },
    }),

    [REMOVE_CUSTOMER]: (state) => ({ ...state, removeState: { loading: true, error: null, isSuccess: false } }),
    [REMOVE_CUSTOMER_SUCCESS]: (state, { payload: idx }) =>
        produce(state, (draft) => {
            const foundIdx = draft.customers.data.findIndex((customer) => customer.idx === idx);
            draft.customers.data?.splice(foundIdx!, 1);
            draft.removeState.loading = false;
            draft.removeState.isSuccess = true;
        }),
    [REMOVE_CUSTOMER_ERROR]: (state, { payload: error }) => ({
        ...state,
        removeState: { loading: false, error, isSuccess: false },
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
    [SET_ADD_SUCCESS]: (state, { payload: isAddCustomerSuccess }) =>
        produce(state, (draft) => {
            draft.addState.isSuccess = isAddCustomerSuccess;
        }),
    [SET_EDIT_SUCCESS]: (state, { payload: isEditCustomerSuccess }) =>
        produce(state, (draft) => {
            draft.editState.isSuccess = isEditCustomerSuccess;
        }),
    [SET_REMOVE_SUCCESS]: (state, { payload: isRemoveCustomerSuccess }) =>
        produce(state, (draft) => {
            draft.removeState.isSuccess = isRemoveCustomerSuccess;
        }),
    [SET_SEARCH_INFO]: (state, { payload: searchInfo }) => ({ ...state, searchInfo }),
    [SET_IS_SEARCHING_NOW]: (state, { payload: isSearchingNow }) => ({
        ...state,
        isSearchingNow,
    }),
    [AUTO_COMPLETE_CUSTOMER_ORDER_FORM_SUCCESS]: (state, { payload: customer }) =>
        produce(state, (draft) => {
            if (customer) {
                draft.customerOrderForm.idx = customer.idx;
                draft.customerOrderForm.address = customer.address;
                draft.customerOrderForm.customerName = customer.customerName;
                draft.customerOrderForm.phoneNumber = customer.phoneNumber;
                draft.customerOrderForm.request = customer.request;
            } else {
                draft.errorMessage = "존재하지 않는 전화번호입니다.";
            }
        }),
    [AUTO_COMPLETE_CUSTOMER_ORDER_FORM_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            alert(error);
        }),

    [RESET_ERROR_MESSAGE]: (state) => ({ ...state, errorMessage: null }),
});

export default customer;
