import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import {
    addProductAction,
    editProductAction,
    moveProductAction,
    removeProductAction,
    setProductFormAction,
    setProductEditModeAction,
} from "module/product";
import { useCallback } from "react";

const useProduct = () => {
    const productForm = useSelector((state: RootState) => state.product.productForm);
    const isProductEditMode = useSelector((state: RootState) => state.product.isProductEditMode);
    const dispatch = useDispatch();

    const addProduct = useCallback(
        (name: string, price: number, categoryIdx: number) => dispatch(addProductAction(name, price, categoryIdx)),
        [dispatch]
    );

    const editProduct = useCallback(
        (idx: number, categoryIdx: number, name: string, price: number) =>
            dispatch(editProductAction(idx, categoryIdx, name, price)),
        [dispatch]
    );

    const moveProduct = useCallback(
        (currentIdx: number, nextIdx: number, srcIdx: number, destIdx: number) =>
            dispatch(moveProductAction(currentIdx, nextIdx, srcIdx, destIdx)),
        [dispatch]
    );

    const removeProduct = useCallback((idx: number) => dispatch(removeProductAction(idx)), [dispatch]);

    const setProductForm = useCallback(
        (idx: number, categoryIdx: string, name: string, price: string) =>
            dispatch(setProductFormAction(idx, categoryIdx, name, price)),
        [dispatch]
    );

    const setProductEditMode = useCallback((isEditMode: boolean) => dispatch(setProductEditModeAction(isEditMode)), [
        dispatch,
    ]);

    return {
        productForm,
        isProductEditMode,
        addProduct,
        editProduct,
        moveProduct,
        removeProduct,
        setProductForm,
        setProductEditMode,
    };
};

export default useProduct;
