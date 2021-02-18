import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import {
    addCustomerAction,
    editCustomerAction,
    removeCustomerAction,
    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
} from "module/customer";

const useCustomer = () => {
    const customers = useSelector((state: RootState) => state.customer.customers);
    const customerOrderForm = useSelector((state: RootState) => state.customer.customerOrderForm);
    const customerManagementForm = useSelector((state: RootState) => state.customer.customerManagementForm);
    const isCustomerOrderFormEditMode = useSelector((state: RootState) => state.customer.isCustomerOrderFormEditMode);
    const isCustomerManagementFormEditMode = useSelector(
        (state: RootState) => state.customer.isCustomerManagementFormEditMode
    );

    const dispatch = useDispatch();

    const addCustomer = useCallback(
        (customerName: string, phoneNumber: string, address: string, request?: string) =>
            dispatch(addCustomerAction(customerName, phoneNumber, address, request)),
        [dispatch]
    );

    const editCustomer = useCallback(
        (idx: number, customerName: string, phoneNumber: string, address: string, request?: string) =>
            dispatch(editCustomerAction(idx, customerName, phoneNumber, address, request)),
        [dispatch]
    );

    const removeCustomer = useCallback((idx: number) => dispatch(removeCustomerAction(idx)), [dispatch]);

    const setCustomerOrderForm = useCallback(
        (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request?: string) =>
            dispatch(setCustomerOrderFormAction(idx, customerName, phoneNumber, address, request)),
        [dispatch]
    );

    const setCustomerManagementForm = useCallback(
        (idx: number | undefined, customerName: string, phoneNumber: string, address: string, request?: string) =>
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

    return {
        customers,
        customerOrderForm,
        customerManagementForm,
        isCustomerOrderFormEditMode,
        isCustomerManagementFormEditMode,
        addCustomer,
        editCustomer,
        removeCustomer,
        setCustomerOrderForm,
        setCustomerManagementForm,
        setCustomerOrderFormEditMode,
        setCustomerManagementFormEditMode,
    };
};

export default useCustomer;
