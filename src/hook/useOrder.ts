import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { addOrderAction, Product, PaymentMethod } from "module/order";
import { useCallback } from "react";

const useOrder = () => {
    const orders = useSelector((state: RootState) => state.order.orders);
    const dispatch = useDispatch();

    const addOrder = useCallback(
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
                addOrderAction(
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
        addOrder,
    };
};

export default useOrder;
