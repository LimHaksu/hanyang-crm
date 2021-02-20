import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import {
    setOrderFormAction,
    addProductAction,
    changeAmountAction,
    removeProductAction,
    changeOrderRequestAction,
    changePaymentMethodAction,
    PaymentMethod,
    OrderForm,
    Order,
} from "module/order";
import { getOrdersAsync, submitOrderAsync, removeOrderAsync, editOrderAsync } from "module/order/saga";
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
    const changeOrderRequest = useCallback((orderRequest: string) => dispatch(changeOrderRequestAction(orderRequest)), [
        dispatch,
    ]);
    const changePaymentMethod = useCallback(
        (paymentMethod: PaymentMethod) => dispatch(changePaymentMethodAction(paymentMethod)),
        [dispatch]
    );

    const getOrders = useCallback(
        (year: number, month: number, date: number) => dispatch(getOrdersAsync.request({ year, month, date })),
        [dispatch]
    );

    const submitOrder = useCallback(
        (order: Omit<Order, "idx" | "customerIdx" | "orderTime">) => dispatch(submitOrderAsync.request(order)),
        [dispatch]
    );
    const editOrder = useCallback((order: Order) => dispatch(editOrderAsync.request(order)), [dispatch]);
    const removeOrder = useCallback((orderIdx: number) => dispatch(removeOrderAsync.request(orderIdx)), [dispatch]);

    return {
        orders,
        orderForm,
        setOrderForm,
        addProduct,
        changeAmount,
        changeOrderRequest,
        changePaymentMethod,
        removeProduct,
        getOrders,
        submitOrder,
        editOrder,
        removeOrder,
    };
};

export default useOrder;
