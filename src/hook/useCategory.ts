import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import { useCallback } from "react";
import {
    getCategoriesAsync,
    addCategoryAsync,
    editCategoryAsync,
    moveCategoryAsync,
    removeCategoryAsync,
} from "module/product/saga";

const useCategory = () => {
    const categories = useSelector((state: RootState) => state.product.categories.data);
    const dispatch = useDispatch();

    const getCategories = useCallback(() => dispatch(getCategoriesAsync.request()), [dispatch]);

    const addCategory = useCallback((name: string) => dispatch(addCategoryAsync.request(name)), [dispatch]);

    const editCategory = useCallback(
        (idx: number, name: string, lexoRank: string) => dispatch(editCategoryAsync.request({ idx, name, lexoRank })),
        [dispatch]
    );

    const moveCategory = useCallback(
        (srcIdx: number, destIdx: number) => dispatch(moveCategoryAsync.request({ srcIdx, destIdx })),
        [dispatch]
    );

    const removeCategory = useCallback((idx: number) => dispatch(removeCategoryAsync.request(idx)), [dispatch]);

    return {
        categories,
        getCategories,
        addCategory,
        editCategory,
        moveCategory,
        removeCategory,
    };
};

export default useCategory;
