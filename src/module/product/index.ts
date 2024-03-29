import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";

export interface Product {
    idx: number;
    name: string;
    price: number;
    lexoRank: string;
    categoryIdx: number;
}

export interface Category {
    idx: number;
    name: string;
    products: Product[];
    lexoRank: string;
}
export const GET_CATEGORIES = "product/GET_CATEGORIES";
export const GET_CATEGORIES_SUCCESS = "product/GET_CATEGORIES_SUCCESS";
export const GET_CATEGORIES_ERROR = "product/GET_CATEGORIES_ERROR";

export const ADD_CATEGORY = "product/ADD_CATEGORY";
export const ADD_CATEGORY_SUCCESS = "product/ADD_CATEGORY_SUCCESS";
export const ADD_CATEGORY_ERROR = "product/ADD_CATEGORY_ERROR";

export const EDIT_CATEGORY = "product/EDIT_CATEGORY";
export const EDIT_CATEGORY_SUCCESS = "product/EDIT_CATEGORY_SUCCESS";
export const EDIT_CATEGORY_ERROR = "product/EDIT_CATEGORY_ERROR";

export const MOVE_CATEGORY = "product/MOVE_CATEGORY";
export const MOVE_CATEGORY_SUCCESS = "product/MOVE_CATEGORY_SUCCESS";
export const MOVE_CATEGORY_ERROR = "product/MOVE_CATEGORY_ERROR";

export const REMOVE_CATEGORY = "product/REMOVE_CATEGORY";
export const REMOVE_CATEGORY_SUCCESS = "product/REMOVE_CATEGORY_SUCCESS";
export const REMOVE_CATEGORY_ERROR = "product/REMOVE_CATEGORY_ERROR";

export const ADD_PRODUCT = "product/ADD_PRODUCT";
export const ADD_PRODUCT_SUCCESS = "product/ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_ERROR = "product/ADD_PRODUCT_ERROR";

export const EDIT_PRODUCT = "product/EDIT_PRODUCT";
export const EDIT_PRODUCT_SUCCESS = "product/EDIT_PRODUCT_SUCCESS";
export const EDIT_PRODUCT_ERROR = "product/EDIT_PRODUCT_ERROR";

export const MOVE_PRODUCT = "product/MOVE_PRODUCT";
export const MOVE_PRODUCT_SUCCESS = "product/MOVE_PRODUCT_SUCCESS";
export const MOVE_PRODUCT_ERROR = "product/MOVE_PRODUCT_ERROR";

export const REMOVE_PRODUCT = "product/REMOVE_PRODUCT";
export const REMOVE_PRODUCT_SUCCESS = "product/REMOVE_PRODUCT_SUCCESS";
export const REMOVE_PRODUCT_ERROR = "product/REMOVE_PRODUCT_ERROR";

const SET_CATEGORY_FORM = "product/SET_CATEGORY_FORM";
const SET_PRODUCT_FORM = "product/SET_PRODUCT_FORM";

const SET_CATEGORY_EDIT_MODE = "product/SET_CATEGORY_MODE";
const SET_PRODUCT_EDIT_MODE = "product/SET_EDIT_MODE";

const getCategories = createAction(GET_CATEGORIES)();
const getCategoriesSuccess = createAction(GET_CATEGORIES_SUCCESS)<Category[]>();
const getCategoriesError = createAction(GET_CATEGORIES_ERROR)<Error>();

const addCategory = createAction(ADD_CATEGORY)();
const addCategorySuccess = createAction(ADD_CATEGORY_SUCCESS)<Category>();
const addCategoryError = createAction(ADD_CATEGORY_ERROR)<Error>();

const editCategorySuccess = createAction(EDIT_CATEGORY_SUCCESS)<Omit<Category, "products" | "lexoRank">>();
const editCategoryError = createAction(EDIT_CATEGORY_ERROR)<Error>();

const moveCategorySuccess = createAction(MOVE_CATEGORY_SUCCESS)<Category[]>();
const moveCategoryError = createAction(MOVE_CATEGORY_ERROR)<Error>();

const removeCategorySuccess = createAction(REMOVE_CATEGORY_SUCCESS)<number>();
const removeCategoryError = createAction(REMOVE_CATEGORY_ERROR)<Error>();

const addProduct = createAction(ADD_PRODUCT)();
const addProductSuccess = createAction(ADD_PRODUCT_SUCCESS)<Product>();
const addProductError = createAction(ADD_PRODUCT_ERROR)<Error>();

const editProductSuccess = createAction(EDIT_PRODUCT_SUCCESS)<Product>();
const editProductError = createAction(EDIT_PRODUCT_ERROR)<Error>();

const moveProductSuccess = createAction(MOVE_PRODUCT_SUCCESS)<Category[]>();
const moveProductError = createAction(MOVE_PRODUCT_ERROR)<Error>();

const removeProductSuccess = createAction(REMOVE_PRODUCT_SUCCESS)<number>();
const removeProductError = createAction(REMOVE_PRODUCT_ERROR)<Error>();

export const setCategoryFormAction = createAction(SET_CATEGORY_FORM, (idx: number, name: string, lexoRank: string) => ({
    idx,
    name,
    lexoRank,
}))();

export const setProductFormAction = createAction(
    SET_PRODUCT_FORM,
    (idx: number, categoryIdx: string, name: string, price: string, lexoRank: string) => ({
        idx,
        categoryIdx,
        name,
        price,
        lexoRank,
    })
)();

export const setCategoryEditModeAction = createAction(SET_CATEGORY_EDIT_MODE, (isEditMode: boolean) => isEditMode)();
export const setProductEditModeAction = createAction(SET_PRODUCT_EDIT_MODE, (isEditMode: boolean) => isEditMode)();

const actions = {
    getCategories,
    getCategoriesSuccess,
    getCategoriesError,

    addCategory,
    addCategorySuccess,
    addCategoryError,

    editCategorySuccess,
    editCategoryError,

    moveCategorySuccess,
    moveCategoryError,

    removeCategorySuccess,
    removeCategoryError,

    addProduct,
    addProductSuccess,
    addProductError,

    editProductSuccess,
    editProductError,

    moveProductSuccess,
    moveProductError,

    removeProductSuccess,
    removeProductError,

    setCategoryFormAction,
    setProductFormAction,
    setCategoryEditModeAction,
    setProductEditModeAction,
};

interface ProductState {
    categories: { loading: boolean; error: Error | null; data: Category[] };
    categoryForm: { idx: number; name: string; lexoRank: string };
    productForm: { idx: number; categoryIdx: string; name: string; price: string; lexoRank: string };
    isCategoryEditMode: boolean;
    isProductEditMode: boolean;
}

const initialState: ProductState = {
    categories: {
        loading: false,
        error: null,
        data: [],
    },
    categoryForm: { idx: -1, name: "", lexoRank: "" },
    productForm: { idx: -1, categoryIdx: "", name: "", price: "", lexoRank: "" },
    isCategoryEditMode: false,
    isProductEditMode: false,
};

type ProductAction = ActionType<typeof actions>;

const product = createReducer<ProductState, ProductAction>(initialState, {
    [GET_CATEGORIES]: (state) =>
        produce(state, (draft) => {
            draft.categories.loading = true;
            draft.categories.error = null;
        }),
    [GET_CATEGORIES_SUCCESS]: (state, { payload: categories }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            draft.categories.data = categories;
        }),
    [GET_CATEGORIES_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            draft.categories.error = error;
        }),

    [ADD_CATEGORY]: (state) =>
        produce(state, (draft) => {
            draft.categories.loading = true;
            draft.categories.error = null;
        }),
    [ADD_CATEGORY_SUCCESS]: (state, { payload: category }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            draft.categories.data.push(category);
        }),
    [ADD_CATEGORY_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            draft.categories.error = error;
        }),

    [EDIT_CATEGORY_SUCCESS]: (state, { payload: { idx, name } }) =>
        produce(state, (draft) => {
            const category = draft.categories.data.find((category) => category.idx === idx);
            if (category) {
                category.name = name;
            }
        }),
    [EDIT_CATEGORY_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            //TODO... 에러 핸들링 로직
        }),

    [MOVE_CATEGORY_SUCCESS]: (state, { payload: categories }) =>
        produce(state, (draft) => {
            // 재정렬된 카테고리 할당
            draft.categories.data = categories;
        }),
    [MOVE_CATEGORY_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            //TODO... 에러 핸들링 로직
            console.error(error);
        }),

    [REMOVE_CATEGORY_SUCCESS]: (state, { payload: idx }) => ({
        ...state,
        categories: { ...state.categories, data: state.categories.data.filter((category) => category.idx !== idx) },
    }),
    [REMOVE_CATEGORY_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            //TODO... 에러 핸들링 로직
        }),

    [ADD_PRODUCT]: (state) =>
        produce(state, (draft) => {
            draft.categories.loading = true;
            draft.categories.error = null;
        }),
    [ADD_PRODUCT_SUCCESS]: (state, { payload: product }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            const products = draft.categories.data.find((category) => category.idx === product.categoryIdx)?.products;
            if (products) {
                products.push(product);
            }
        }),
    [ADD_PRODUCT_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            draft.categories.loading = false;
            draft.categories.error = error;
        }),

    [EDIT_PRODUCT_SUCCESS]: (state, { payload: { idx, categoryIdx, name, price } }) =>
        produce(state, (draft) => {
            const products = draft.categories.data.find((category) => category.idx === categoryIdx)?.products;
            if (products) {
                const product = products.find((product) => product.idx === idx);
                if (product) {
                    product.name = name;
                    product.price = price;
                }
            }
        }),
    [EDIT_PRODUCT_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            //TODO... 에러 핸들링 로직
        }),

    [MOVE_PRODUCT_SUCCESS]: (state, { payload: categories }) =>
        produce(state, (draft) => {
            draft.categories.data = categories;
        }),
    [MOVE_PRODUCT_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),

    [REMOVE_PRODUCT_SUCCESS]: (state, { payload: idx }) =>
        produce(state, (draft) => {
            draft.categories.data.forEach((category) => {
                const foundProductIdx = category.products.findIndex((product) => product.idx === idx);
                if (foundProductIdx >= 0) {
                    category.products.splice(foundProductIdx, 1);
                }
            });
        }),
    [REMOVE_PRODUCT_ERROR]: (state, { payload: error }) =>
        produce(state, (draft) => {
            // TODO... 에러 핸들링 로직
        }),

    [SET_CATEGORY_FORM]: (state, { payload: categoryForm }) => ({ ...state, categoryForm }),
    [SET_PRODUCT_FORM]: (state, { payload: productForm }) => ({ ...state, productForm }),
    [SET_CATEGORY_EDIT_MODE]: (state, { payload: isEditMode }) => ({ ...state, isCategoryEditMode: isEditMode }),
    [SET_PRODUCT_EDIT_MODE]: (state, { payload: isEditMode }) => ({ ...state, isProductEditMode: isEditMode }),
});

export default product;
