import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";

export interface Product {
    idx: number;
    name: string;
    price: number;
    lexoRank: string;
}

export interface Category {
    idx: number;
    name: string;
    products: Product[];
    lexoRank: string;
}

const ADD_CATEGORY = "product/ADD_CATEGORY";
const ADD_PRODUCT = "product/ADD_PRODUCT";
const EDIT_PRODUCT = "product/EDIT_PRODUCT";

export const addCategoryAction = createAction(ADD_CATEGORY, (idx: number, name: string, lexoRank: string) => ({
    idx,
    name,
    products: [] as Product[],
    lexoRank,
}))();

export const addProductAction = createAction(
    ADD_PRODUCT,
    (idx: number, name: string, price: number, lexoRank: string, categoryIdx: number) => ({
        idx,
        name,
        price,
        lexoRank,
        categoryIdx,
    })
)();

export const editProductAction = createAction(
    EDIT_PRODUCT,
    ({ idx, name, price, lexoRank }: { idx: number; name?: string; price?: number; lexoRank?: string }) => ({
        idx,
        name,
        price,
        lexoRank,
    })
)();

const actions = { addCategoryAction, addProductAction, editProductAction };

interface ProductState {
    categories: Category[];
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
            lexoRank: "a",
        },
        {
            idx: 1,
            name: "보쌈",
            products: [
                { idx: 2, name: "1인보쌈", price: 20000, lexoRank: "a" },
                { idx: 3, name: "보쌈小", price: 30000, lexoRank: "b" },
            ],
            lexoRank: "b",
        },
        {
            idx: 2,
            name: "추가메뉴",
            products: [
                { idx: 4, name: "콜라", price: 3000, lexoRank: "a" },
                { idx: 5, name: "사이다", price: 3000, lexoRank: "b" },
            ],
            lexoRank: "c",
        },
        {
            idx: 3,
            name: "할인",
            products: [
                { idx: 6, name: "내방객", price: -3000, lexoRank: "a" },
                { idx: 7, name: "쿠폰", price: -2000, lexoRank: "b" },
            ],
            lexoRank: "d",
        },
    ],
};

type ProductAction = ActionType<typeof actions>;

const product = createReducer<ProductState, ProductAction>(initialState, {
    [ADD_CATEGORY]: (state, { payload: category }) =>
        produce(state, (draft) => {
            draft.categories.push(category);
        }),
    [ADD_PRODUCT]: (state, { payload: product }) =>
        produce(state, (draft) => {
            const { idx, name, price, lexoRank } = product;
            draft.categories
                .find((category) => category.idx === product.categoryIdx)
                ?.products.push({ idx, name, price, lexoRank });
        }),
    [EDIT_PRODUCT]: (state, { payload: { idx, name, price, lexoRank } }) =>
        produce(state, (draft) => {
            draft.categories.forEach((category) => {
                const foundProduct = category.products.find((product) => product.idx === idx);
                if (foundProduct) {
                    if (name) {
                        foundProduct.name = name;
                    }
                    if (price) {
                        foundProduct.price = price;
                    }
                    if (lexoRank) {
                        foundProduct.lexoRank = lexoRank;
                    }
                }
            });
        }),
});

export default product;
