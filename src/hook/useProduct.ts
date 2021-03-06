import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import { setProductFormAction, setProductEditModeAction } from "module/product";
import { addProductAsync, editProductAsync, moveProductAsync, removeProductAsync } from "module/product/saga";
import { useCallback } from "react";

const useProduct = () => {
    const productForm = useSelector((state: RootState) => state.product.productForm);
    const isProductEditMode = useSelector((state: RootState) => state.product.isProductEditMode);
    const dispatch = useDispatch();

    const addProduct = useCallback(
        (name: string, price: number, categoryIdx: number) =>
            dispatch(addProductAsync.request({ name, price, categoryIdx })),
        [dispatch]
    );

    const editProduct = useCallback(
        (idx: number, categoryIdx: number, name: string, price: number, lexoRank: string) =>
            dispatch(editProductAsync.request({ idx, categoryIdx, name, price, lexoRank })),
        [dispatch]
    );

    const moveProduct = useCallback(
        (currentIndex: number, nextIndex: number, srcIdx: number, destIdx: number) =>
            dispatch(moveProductAsync.request({ currentIndex, nextIndex, srcIdx, destIdx })),
        [dispatch]
    );

    const removeProduct = useCallback((idx: number) => dispatch(removeProductAsync.request(idx)), [dispatch]);

    const setProductForm = useCallback(
        (idx: number, categoryIdx: string, name: string, price: string, lexoRank: string) =>
            dispatch(setProductFormAction(idx, categoryIdx, name, price, lexoRank)),
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
