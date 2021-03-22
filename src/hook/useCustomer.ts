import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { useCallback } from "react";
import {
    setAddSuccessAction,
    setEditSuccessAction,
    setRemoveSuccessAction,
    setSearchInfoAction,
    setIsSearchingNowAction,
    SearchBy,
} from "module/customer";
import { searchCustomersAsync, addCustomerAsync, editCustomerAsync, removeCustomerAsync } from "module/customer/saga";

const useCustomer = () => {
    const customers = useSelector((state: RootState) => state.customer.customers.data);
    const isAddCustomerSuccess = useSelector((state: RootState) => state.customer.addState.isSuccess);
    const isEditCustomerSuccess = useSelector((state: RootState) => state.customer.editState.isSuccess);
    const isRemoveCustomerSuccess = useSelector((state: RootState) => state.customer.removeState.isSuccess);
    const searchInfo = useSelector((state: RootState) => state.customer.searchInfo);
    const isSearchingNow = useSelector((state: RootState) => state.customer.isSearchingNow);

    const dispatch = useDispatch();

    const searchCustomer = useCallback(
        (searchBy: SearchBy, keyword: string, startIndex: number, isAppendMode: boolean) =>
            dispatch(searchCustomersAsync.request({ searchBy, keyword, startIndex, isAppendMode })),
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

    const setSearchInfo = useCallback(
        ({ searchBy, keyword }: { searchBy: SearchBy; keyword: string }) =>
            dispatch(setSearchInfoAction({ searchBy, keyword })),
        [dispatch]
    );

    const setIsSearchingNow = useCallback(
        (isSearchingNow: boolean) => dispatch(setIsSearchingNowAction(isSearchingNow)),
        [dispatch]
    );

    return {
        customers,
        isAddCustomerSuccess,
        isEditCustomerSuccess,
        isRemoveCustomerSuccess,
        searchInfo,
        isSearchingNow,
        searchCustomer,
        addCustomer,
        editCustomer,
        removeCustomer,
        setAddSuccess,
        setEditSuccess,
        setRemoveSuccess,
        setSearchInfo,
        setIsSearchingNow,
    };
};

export default useCustomer;
