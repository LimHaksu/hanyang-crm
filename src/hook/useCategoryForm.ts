import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import { setCategoryFormAction, setCategoryEditModeAction } from "module/product";
import { useCallback } from "react";

const useCategoryForm = () => {
    const categoryForm = useSelector((state: RootState) => state.product.categoryForm);
    const isCategoryEditMode = useSelector((state: RootState) => state.product.isCategoryEditMode);
    const dispatch = useDispatch();

    const setCategoryForm = useCallback(
        (idx: number, name: string, lexoRank: string) => dispatch(setCategoryFormAction(idx, name, lexoRank)),
        [dispatch]
    );

    const setCategoryEditMode = useCallback((isEditMode: boolean) => dispatch(setCategoryEditModeAction(isEditMode)), [
        dispatch,
    ]);

    return {
        categoryForm,
        isCategoryEditMode,
        setCategoryForm,
        setCategoryEditMode,
    };
};

export default useCategoryForm;
