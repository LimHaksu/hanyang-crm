import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import {
    submitOrderAction,
    setOrderFormAction,
    addProductAction,
    changeAmountAction,
    removeProductAction,
    OrderForm,
    PaymentMethod,
} from "module/order";
import { Product } from "module/product";
import { useCallback } from "react";

const useOrder = () => {
    const orders = useSelector((state: RootState) => state.order.orders);
    const orderForm = useSelector((state: RootState) => state.order.orderForm);
    const dispatch = useDispatch();

    const setOrderForm = useCallback((orderForm: OrderForm) => dispatch(setOrderFormAction(orderForm)), [dispatch]);

    const addProduct = useCallback((product: Product & { amount: number }) => dispatch(addProductAction(product)), [
        dispatch,
    ]);
    const changeAmount = useCallback((index: number, amount: number) => dispatch(changeAmountAction(index, amount)), [
        dispatch,
    ]);
    const removeProduct = useCallback((index: number) => dispatch(removeProductAction(index)), [dispatch]);

    const submitOrder = useCallback(
        (
            idx: number,
            orderTime: number,
            customerName: string,
            phoneNumber: string,
            address: string,
            productName: string,
            products: Product[],
            request: string,
            customerRequest: string,
            orderRequest: string,
            paymentMethod: PaymentMethod,
            price: number
        ) =>
            dispatch(
                submitOrderAction(
                    idx,
                    orderTime,
                    productName,
                    request,
                    customerName,
                    phoneNumber,
                    address,
                    customerRequest,
                    products,
                    price,
                    orderRequest,
                    paymentMethod
                )
            ),
        [dispatch]
    );

    return {
        orders,
        orderForm,
        setOrderForm,
        submitOrder,
        addProduct,
        changeAmount,
        removeProduct,
    };
};

export default useOrder;
