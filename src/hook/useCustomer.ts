import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import { setAddSuccessAction, setEditSuccessAction, setRemoveSuccessAction, SearchBy } from "module/customer";
import { searchCustomersAsync, addCustomerAsync, editCustomerAsync, removeCustomerAsync } from "module/customer/saga";

const useCustomer = () => {
    const customers = useSelector((state: RootState) => state.customer.customers.data);
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
        isAddCustomerSuccess,
        isEditCustomerSuccess,
        isRemoveCustomerSuccess,
        searchCustomer,
        addCustomer,
        editCustomer,
        removeCustomer,
        setAddSuccess,
        setEditSuccess,
        setRemoveSuccess,
    };
};

export default useCustomer;
