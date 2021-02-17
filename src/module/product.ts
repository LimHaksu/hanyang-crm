import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { getRankBetween } from "util/lexoRank";

export interface Product {
    idx: number;
    name: string;
    price: number;
    lexoRank: string;
    categoryIdx?: string;
}

export interface Category {
    idx: number;
    name: string;
    products: Product[];
    lexoRank: string;
}

const DEFAULT_LEXORANK_LENGTH = 8;
const A_LEXO_RANK = "a".repeat(DEFAULT_LEXORANK_LENGTH);
const Z_LEXO_RANK = "z".repeat(DEFAULT_LEXORANK_LENGTH);

const ADD_CATEGORY = "product/ADD_CATEGORY";
const EDIT_CATEGORY = "product/EDIT_CATEGORY";
const MOVE_CATEGORY = "product/MOVE_CATEGORY";
const REMOVE_CATEGORY = "product/REMOVE_CATEGORY";

const ADD_PRODUCT = "product/ADD_PRODUCT";
const EDIT_PRODUCT = "product/EDIT_PRODUCT";
const MOVE_PRODUCT = "product/MOVE_PRODUCT";
const REMOVE_PRODUCT = "product/REMOVE_PRODUCT";

const SET_CATEGORY_FORM = "product/SET_CATEGORY_FORM";
const SET_PRODUCT_FORM = "product/SET_PRODUCT_FORM";

const SET_CATEGORY_EDIT_MODE = "product/SET_CATEGORY_MODE";
const SET_PRODUCT_EDIT_MODE = "product/SET_EDIT_MODE";

const SET_LAST_CATEGORY_IDX = "product/SET_LAST_CATEGORY_IDX";
const SET_LAST_PRODUCT_IDX = "product/SET_LAST_PRODUCT_IDX";

export const addCategoryAction = createAction(ADD_CATEGORY, (name: string) => ({
    name,
    products: [] as Product[],
}))();

export const editCategoryAction = createAction(EDIT_CATEGORY, (idx: number, name: string) => ({
    idx,
    name,
}))();

export const moveCategoryAction = createAction(MOVE_CATEGORY, (srcIdx: number, destIdx: number) => ({
    srcIdx,
    destIdx,
}))();

export const removeCategoryAction = createAction(REMOVE_CATEGORY, (idx: number) => idx)();

export const addProductAction = createAction(ADD_PRODUCT, (name: string, price: number, categoryIdx: number) => ({
    name,
    price,
    categoryIdx,
}))();

export const editProductAction = createAction(
    EDIT_PRODUCT,
    (idx: number, categoryIdx: number, name: string, price: number) => ({
        idx,
        categoryIdx,
        name,
        price,
    })
)();

export const moveProductAction = createAction(
    MOVE_PRODUCT,
    (currentIdx: number, nextIdx: number, srcIdx: number, destIdx: number) => ({
        currentIdx,
        nextIdx,
        srcIdx,
        destIdx,
    })
)();

export const removeProductAction = createAction(REMOVE_PRODUCT, (idx: number) => idx)();

export const setCategoryFormAction = createAction(SET_CATEGORY_FORM, (idx: number, name: string) => ({ idx, name }))();

export const setProductFormAction = createAction(
    SET_PRODUCT_FORM,
    (idx: number, categoryIdx: string, name: string, price: string) => ({ idx, categoryIdx, name, price })
)();

export const setCategoryEditModeAction = createAction(SET_CATEGORY_EDIT_MODE, (isEditMode: boolean) => isEditMode)();
export const setProductEditModeAction = createAction(SET_PRODUCT_EDIT_MODE, (isEditMode: boolean) => isEditMode)();

export const setLastCategoryIdxAction = createAction(SET_LAST_CATEGORY_IDX, (idx: number) => idx)();
export const setLastProductIdxAction = createAction(SET_LAST_PRODUCT_IDX, (idx: number) => idx)();

const actions = {
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
};

interface ProductState {
    categories: Category[];
    categoryForm: { idx: number; name: string };
    productForm: { idx: number; categoryIdx: string; name: string; price: string };
    isCategoryEditMode: boolean;
    isProductEditMode: boolean;
    lastCategoryIdx: number;
    lastProductIdx: number;
}

const initialState: ProductState = {
    categories: [
        {
            idx: 0,
            name: "족발",
            products: [
                { idx: 0, name: "1인족발", price: 20000, lexoRank: "a" },
                { idx: 1, name: "족발小", price: 30000, lexoRank: "b" },
            ],
            lexoRank: "gmzzzzmf",
        },
        {
            idx: 1,
            name: "보쌈",
            products: [
                { idx: 2, name: "1인보쌈", price: 20000, lexoRank: "a" },
                { idx: 3, name: "보쌈小", price: 30000, lexoRank: "b" },
            ],
            lexoRank: "gmzzzzzz",
        },
        {
            idx: 2,
            name: "추가메뉴",
            products: [
                { idx: 4, name: "콜라", price: 3000, lexoRank: "a" },
                { idx: 5, name: "사이다", price: 3000, lexoRank: "b" },
            ],
            lexoRank: "lzzzzzmf",
        },
        {
            idx: 3,
            name: "할인",
            products: [
                { idx: 6, name: "내방객", price: -3000, lexoRank: "a" },
                { idx: 7, name: "쿠폰", price: -2000, lexoRank: "b" },
            ],
            lexoRank: "lzzzzzzk",
        },
    ],
    categoryForm: { idx: -1, name: "" },
    productForm: { idx: -1, categoryIdx: "", name: "", price: "" },
    isCategoryEditMode: false,
    isProductEditMode: false,
    lastCategoryIdx: 0,
    lastProductIdx: 0,
};

type ProductAction = ActionType<typeof actions>;

const product = createReducer<ProductState, ProductAction>(initialState, {
    [ADD_CATEGORY]: (state, { payload: category }) =>
        produce(state, (draft) => {
            const categories = draft.categories;
            const clen = categories.length;
            // 마지막 카테고리 인덱스 1 증가
            draft.lastCategoryIdx += 1;
            if (clen === 1) {
                // 마지막 한칸 전이 없는경우(길이 1)에는 'a'* defaultLexoRankLength 와 마지막의 중간값
                categories[clen - 1].lexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
            } else if (clen !== 0) {
                // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
                categories[clen - 1].lexoRank = getRankBetween(categories[clen - 2].lexoRank, Z_LEXO_RANK);
            }
            // 새로운 lexoRank는 기존의 마지막 lexoRank (= 'z'* defaultLexoRankLength ),
            categories.push({ ...category, idx: draft.lastCategoryIdx, lexoRank: Z_LEXO_RANK });
        }),
    [EDIT_CATEGORY]: (state, { payload: { idx, name } }) => ({
        ...state,
        categories: state.categories.map((category) => {
            if (category.idx !== idx) {
                return category;
            }
            return { ...category, name };
        }),
    }),
    [MOVE_CATEGORY]: (state, { payload: { srcIdx, destIdx } }) =>
        produce(state, (draft) => {
            // categories는 정렬돼있는 상태
            const categories = draft.categories;

            if (srcIdx < destIdx) {
                if (destIdx === categories.length - 1) {
                    // destCategory가 마지막 카테고리인 경우
                    categories[srcIdx].lexoRank = Z_LEXO_RANK;
                    categories[destIdx].lexoRank = getRankBetween(categories[destIdx].lexoRank, Z_LEXO_RANK);
                } else {
                    // destCategory 뒤에 카테고리가 있는 경우
                    categories[srcIdx].lexoRank = getRankBetween(
                        categories[destIdx].lexoRank,
                        categories[destIdx + 1].lexoRank
                    );
                }
            } else {
                if (destIdx === 0) {
                    // destCategory가 첫번째 카테고리인 경우
                    categories[srcIdx].lexoRank = A_LEXO_RANK;
                    categories[destIdx].lexoRank = getRankBetween(A_LEXO_RANK, categories[destIdx].lexoRank);
                } else {
                    // destCategory 앞에 카테고리가 있는 경우
                    categories[srcIdx].lexoRank = getRankBetween(
                        categories[destIdx - 1].lexoRank,
                        categories[destIdx].lexoRank
                    );
                }
            }

            // 정렬
            categories.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
        }),
    [REMOVE_CATEGORY]: (state, { payload: idx }) => ({
        ...state,
        categories: state.categories.filter((category) => category.idx !== idx),
    }),
    [ADD_PRODUCT]: (state, { payload: { name, price, categoryIdx } }) =>
        produce(state, (draft) => {
            draft.lastProductIdx += 1;
            const products = draft.categories.find((category) => category.idx === categoryIdx)?.products;
            if (products) {
                const plen = products.length;
                if (plen === 1) {
                    // 마지막 한칸 전이 없는경우(길이 1)에는 'a'* defaultLexoRankLength 와 마지막의 중간값
                    products[plen - 1].lexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
                } else if (plen !== 0) {
                    // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
                    products[plen - 1].lexoRank = getRankBetween(products[plen - 2].lexoRank, Z_LEXO_RANK);
                }
                // 새로운 lexoRank는 기존의 마지막 lexoRank (= 'z'* defaultLexoRankLength ),
                products.push({ idx: draft.lastCategoryIdx, name, price, lexoRank: Z_LEXO_RANK });
            }
        }),
    [EDIT_PRODUCT]: (state, { payload: { idx, categoryIdx, name, price } }) =>
        produce(state, (draft) => {
            draft.categories.forEach((category) => {
                if (category.idx === categoryIdx) {
                    const foundProduct = category.products.find((product) => product.idx === idx);
                    if (foundProduct) {
                        foundProduct.name = name;
                        foundProduct.price = price;
                    }
                }
            });
        }),
    [MOVE_PRODUCT]: (state, { payload: { currentIdx, nextIdx, srcIdx, destIdx } }) =>
        produce(state, (draft) => {
            const categories = draft.categories;

            // 같은 카테고리 내에서 이동
            if (currentIdx === nextIdx) {
                const products = categories[currentIdx].products;
                if (srcIdx < destIdx) {
                    if (destIdx === products.length - 1) {
                        // destProduct가 마지막 상품인 경우
                        products[srcIdx].lexoRank = Z_LEXO_RANK;
                        products[destIdx].lexoRank = getRankBetween(products[destIdx].lexoRank, Z_LEXO_RANK);
                    } else {
                        // destProduct 뒤에 상품이 있는 경우
                        products[srcIdx].lexoRank = getRankBetween(
                            products[destIdx].lexoRank,
                            products[destIdx + 1].lexoRank
                        );
                    }
                } else {
                    if (destIdx === 0) {
                        // destProduct가 첫번째 상품인 경우
                        products[srcIdx].lexoRank = A_LEXO_RANK;
                        products[destIdx].lexoRank = getRankBetween(A_LEXO_RANK, products[destIdx].lexoRank);
                    } else {
                        // destProduct 앞에 상품이 있는 경우
                        products[srcIdx].lexoRank = getRankBetween(
                            products[destIdx - 1].lexoRank,
                            products[destIdx].lexoRank
                        );
                    }
                }
                // 정렬
                products.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
            } else {
                // 다른 카테고리로 이동
                const [srcProduct] = categories[currentIdx].products.splice(srcIdx, 1);
                const destProducts = categories[nextIdx].products;
                destProducts.push(srcProduct);
                if (destProducts.length === 1) {
                    srcProduct.lexoRank = Z_LEXO_RANK;
                } else if (destIdx === 0) {
                    // destProduct가 첫번째 상품인 경우
                    srcProduct.lexoRank = A_LEXO_RANK;
                    destProducts[destIdx].lexoRank = getRankBetween(A_LEXO_RANK, destProducts[destIdx].lexoRank);
                } else {
                    // destProduct 앞에 상품이 있는 경우
                    srcProduct.lexoRank = getRankBetween(
                        destProducts[destIdx - 1].lexoRank,
                        destProducts[destIdx].lexoRank
                    );
                }
                destProducts.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
            }
        }),
    [REMOVE_PRODUCT]: (state, { payload: idx }) =>
        produce(state, (draft) => {
            draft.categories.forEach((category) => {
                const foundProductIdx = category.products.findIndex((product) => product.idx === idx);
                if (foundProductIdx >= 0) {
                    category.products.splice(foundProductIdx, 1);
                }
            });
        }),
    [SET_CATEGORY_FORM]: (state, { payload: categoryForm }) => ({ ...state, categoryForm }),
    [SET_PRODUCT_FORM]: (state, { payload: productForm }) => ({ ...state, productForm }),
    [SET_CATEGORY_EDIT_MODE]: (state, { payload: isEditMode }) => ({ ...state, isCategoryEditMode: isEditMode }),
    [SET_PRODUCT_EDIT_MODE]: (state, { payload: isEditMode }) => ({ ...state, isProductEditMode: isEditMode }),
    [SET_LAST_CATEGORY_IDX]: (state, { payload: lastCategoryIdx }) => ({ ...state, lastCategoryIdx }),
    [SET_LAST_PRODUCT_IDX]: (state, { payload: lastProductIdx }) => ({ ...state, lastProductIdx }),
});

export default product;
