import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import {
    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
    CustomerForm,
    resetErrorMessageAction,
    SearchBy,
    resetOrdersByCustomerAction,
} from "module/customer";
import { autoCompleteCustomerOrderFormAsync, getOrdersByCustomerAsync } from "module/customer/saga";

const useCustomerForm = () => {
    const customerOrderForm = useSelector((state: RootState) => state.customer.customerOrderForm);
    const customerManagementForm = useSelector((state: RootState) => state.customer.customerManagementForm);
    const isCustomerOrderFormEditMode = useSelector((state: RootState) => state.customer.isCustomerOrderFormEditMode);
    const isCustomerManagementFormEditMode = useSelector(
        (state: RootState) => state.customer.isCustomerManagementFormEditMode
    );
    const errorMessage = useSelector((state: RootState) => state.customer.errorMessage);
    const ordersByCustomer = useSelector((state: RootState) => state.customer.ordersByCustomer);

    const dispatch = useDispatch();

    const setCustomerOrderForm = useCallback(
        (customerOrderForm: CustomerForm) => dispatch(setCustomerOrderFormAction(customerOrderForm)),
        [dispatch]
    );
    const getOrdersByCustomer = useCallback(
        (customerIdx: number) => dispatch(getOrdersByCustomerAsync.request(customerIdx)),
        [dispatch]
    );

    const setCustomerManagementForm = useCallback(
        (customerManagementForm: CustomerForm) => dispatch(setCustomerManagementFormAction(customerManagementForm)),
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

    const autoCompleteCustomerOrderForm = useCallback(
        ({ searchBy, keyword }: { searchBy: SearchBy; keyword: string }) =>
            dispatch(autoCompleteCustomerOrderFormAsync.request({ searchBy, keyword })),
        [dispatch]
    );

    const resetErrorMessage = useCallback(() => dispatch(resetErrorMessageAction()), [dispatch]);

    const resetOrdersByCustomer = useCallback(() => dispatch(resetOrdersByCustomerAction()), [dispatch]);

    return {
        customerOrderForm,
        customerManagementForm,
        isCustomerOrderFormEditMode,
        isCustomerManagementFormEditMode,
        errorMessage,
        ordersByCustomer,
        setCustomerOrderForm,
        setCustomerManagementForm,
        setCustomerOrderFormEditMode,
        setCustomerManagementFormEditMode,
        resetErrorMessage,
        getOrdersByCustomer,
        autoCompleteCustomerOrderForm,
        resetOrdersByCustomer,
    };
};

export default useCustomerForm;
