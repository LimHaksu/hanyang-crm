import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import {
    setCustomerOrderFormAction,
    setCustomerManagementFormAction,
    setCustomerOrderFormEditModeAction,
    setCustomerManagementFormEditModeAction,
    CustomerForm,
} from "module/customer";

const useCustomerForm = () => {
    const customerOrderForm = useSelector((state: RootState) => state.customer.customerOrderForm);
    const customerManagementForm = useSelector((state: RootState) => state.customer.customerManagementForm);
    const isCustomerOrderFormEditMode = useSelector((state: RootState) => state.customer.isCustomerOrderFormEditMode);
    const isCustomerManagementFormEditMode = useSelector(
        (state: RootState) => state.customer.isCustomerManagementFormEditMode
    );

    const dispatch = useDispatch();

    const setCustomerOrderForm = useCallback(
        (customerOrderForm: CustomerForm) => dispatch(setCustomerOrderFormAction(customerOrderForm)),
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

    return {
        customerOrderForm,
        customerManagementForm,
        isCustomerOrderFormEditMode,
        isCustomerManagementFormEditMode,
        setCustomerOrderForm,
        setCustomerManagementForm,
        setCustomerOrderFormEditMode,
        setCustomerManagementFormEditMode,
    };
};

export default useCustomerForm;
