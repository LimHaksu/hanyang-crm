import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import {
    addCategoryAction,
    editCategoryAction,
    moveCategoryAction,
    removeCategoryAction,
    addProductAction,
    editProductAction,
    moveProductAction,
    removeProductAction,
    setCategoryFormAction,
    setProductFormAction,
    setCategoryEditModeAction,
    setProductEditModeAction,
    setLastCategoryIdxAction,
    setLastProductIdxAction,
} from "module/product";
import { useCallback } from "react";

const useProduct = () => {
    const categories = useSelector((state: RootState) => state.product.categories);
    const categoryForm = useSelector((state: RootState) => state.product.categoryForm);
    const productForm = useSelector((state: RootState) => state.product.productForm);
    const isCategoryEditMode = useSelector((state: RootState) => state.product.isCategoryEditMode);
    const isProductEditMode = useSelector((state: RootState) => state.product.isProductEditMode);

    const dispatch = useDispatch();

    const addCategory = useCallback((name: string) => dispatch(addCategoryAction(name)), [dispatch]);

    const editCategory = useCallback((idx: number, name: string) => dispatch(editCategoryAction(idx, name)), [
        dispatch,
    ]);

    const moveCategory = useCallback(
        (srcIdx: number, destIdx: number) => dispatch(moveCategoryAction(srcIdx, destIdx)),
        [dispatch]
    );

    const removeCategory = useCallback((idx: number) => dispatch(removeCategoryAction(idx)), [dispatch]);

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

    const setCategoryForm = useCallback((idx: number, name: string) => dispatch(setCategoryFormAction(idx, name)), [
        dispatch,
    ]);

    const setProductForm = useCallback(
        (idx: number, categoryIdx: string, name: string, price: string) =>
            dispatch(setProductFormAction(idx, categoryIdx, name, price)),
        [dispatch]
    );

    const setCategoryEditMode = useCallback((isEditMode: boolean) => dispatch(setCategoryEditModeAction(isEditMode)), [
        dispatch,
    ]);
    const setProductEditMode = useCallback((isEditMode: boolean) => dispatch(setProductEditModeAction(isEditMode)), [
        dispatch,
    ]);

    const setLastCategoryIdx = useCallback((idx: number) => dispatch(setLastCategoryIdxAction(idx)), [dispatch]);
    const setLastProductIdx = useCallback((idx: number) => dispatch(setLastProductIdxAction(idx)), [dispatch]);

    return {
        categories,
        categoryForm,
        productForm,
        isCategoryEditMode,
        isProductEditMode,
        addCategory,
        editCategory,
        moveCategory,
        removeCategory,
        addProduct,
        editProduct,
        moveProduct,
        removeProduct,
        setCategoryForm,
        setProductForm,
        setCategoryEditMode,
        setProductEditMode,
        setLastCategoryIdx,
        setLastProductIdx,
    };
};

export default useProduct;
