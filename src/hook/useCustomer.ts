import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import {
    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
    setAddSuccessAction,
    setEditSuccessAction,
    setRemoveSuccessAction,
    SearchBy,
} from "module/customer";
import { searchCustomersAsync, addCustomerAsync, editCustomerAsync, removeCustomerAsync } from "module/customer/saga";

const useCustomer = () => {
    const customers = useSelector((state: RootState) => state.customer.customers.data);
    const customerOrderForm = useSelector((state: RootState) => state.customer.customerOrderForm);
    const customerManagementForm = useSelector((state: RootState) => state.customer.customerManagementForm);
    const isCustomerOrderFormEditMode = useSelector((state: RootState) => state.customer.isCustomerOrderFormEditMode);
    const isCustomerManagementFormEditMode = useSelector(
        (state: RootState) => state.customer.isCustomerManagementFormEditMode
    );
    const isAddCustomerSuccess = useSelector((state: RootState) => state.customer.addState.isSuccess);
    const isEditCustomerSuccess = useSelector((state: RootState) => state.customer.editState.isSuccess);
    const isRemoveCustomerSuccess = useSelector((state: RootState) => state.customer.removeState.isSuccess);

    const dispatch = useDispatch();

    const searchCustomer = useCallback(
        (searchBy: SearchBy, keyword: string) => dispatch(searchCustomersAsync.request({ searchBy, keyword })),
        [dispatch]
    );

    const addCustomer = useCallback(
        (customerName: string, phoneNumber: string, address: string, request: string) =>
            dispatch(addCustomerAsync.request({ name: customerName, phoneNumber, address, request })),
        [dispatch]
    );

    const editCustomer = useCallback(
        (idx: number, customerName: string, phoneNumber: string, address: string, request: string) =>
            dispatch(editCustomerAsync.request({ idx, customerName, phoneNumber, address, request })),
        [dispatch]
    );

    const removeCustomer = useCallback((idx: number) => dispatch(removeCustomerAsync.request(idx)), [dispatch]);

    const setCustomerOrderForm = useCallback(
        (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request: string) =>
            dispatch(setCustomerOrderFormAction(idx, customerName, phoneNumber, address, request)),
        [dispatch]
    );

    const setCustomerManagementForm = useCallback(
        (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request: string) =>
            dispatch(setCustomerManagementFormAction(idx, customerName, phoneNumber, address, request)),
        [dispatch]
    );

    const setCustomerOrderFormEditMode = useCallback(
        (isEditMode: boolean) => dispatch(setCustomerOrderFormEditModeAction(isEditMode)),
        [dispatch]
    );

    const setCustomerManagementFormEditMode = useCallback(
        (isEditMode: boolean) => dispatch(setCustomerManagementFormEditModeAction(isEditMode)),
        [dispatch]
    );

    const setAddSuccess = useCallback(
        (isAddCustomerSuccess: boolean) => dispatch(setAddSuccessAction(isAddCustomerSuccess)),
        [dispatch]
    );

    const setEditSuccess = useCallback(
        (isEditCustomerSuccess: boolean) => dispatch(setEditSuccessAction(isEditCustomerSuccess)),
        [dispatch]
    );

    const setRemoveSuccess = useCallback(
        (isRemoveCustomerSuccess: boolean) => dispatch(setRemoveSuccessAction(isRemoveCustomerSuccess)),
        [dispatch]
    );

    return {
        customers,
        customerOrderForm,
        customerManagementForm,
        isCustomerOrderFormEditMode,
        isCustomerManagementFormEditMode,
        isAddCustomerSuccess,
        isEditCustomerSuccess,
        isRemoveCustomerSuccess,
        searchCustomer,
        addCustomer,
        editCustomer,
        removeCustomer,
        setCustomerOrderForm,
        setCustomerManagementForm,
        setCustomerOrderFormEditMode,
        setCustomerManagementFormEditMode,
        setAddSuccess,
        setEditSuccess,
        setRemoveSuccess,
    };
};

export default useCustomer;
