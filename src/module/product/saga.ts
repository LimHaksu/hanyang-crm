import { select, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import { getCategories, addCategory, editCategory, removeCategory, addProduct, editProduct } from "db/product";
import { RootState } from "../index";
import { getRankBetween, A_LEXO_RANK, Z_LEXO_RANK } from "util/lexoRank";
import {
    Category,
    Product,
    CHANGE_CATEGORY_LEXO_RANK,
    CHANGE_PRODUCT_LEXO_RANK,
    GET_CATEGORIES,
    GET_CATEGORIES_SUCCESS,
    GET_CATEGORIES_ERROR,
    ADD_CATEGORY,
    ADD_CATEGORY_SUCCESS,
    ADD_CATEGORY_ERROR,
    EDIT_CATEGORY,
    EDIT_CATEGORY_SUCCESS,
    EDIT_CATEGORY_ERROR,
    MOVE_CATEGORY,
    MOVE_CATEGORY_SUCCESS,
    MOVE_CATEGORY_ERROR,
    REMOVE_CATEGORY,
    REMOVE_CATEGORY_SUCCESS,
    REMOVE_CATEGORY_ERROR,
    ADD_PRODUCT,
    ADD_PRODUCT_SUCCESS,
    ADD_PRODUCT_ERROR,
    EDIT_PRODUCT,
    EDIT_PRODUCT_SUCCESS,
    EDIT_PRODUCT_ERROR,
} from "module/product";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
export const getCategoriesAsync = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_ERROR)<
    undefined,
    Category[],
    Error
>();

export const addCategoryAsync = createAsyncAction(ADD_CATEGORY, ADD_CATEGORY_SUCCESS, ADD_CATEGORY_ERROR)<
    string,
    Category,
    Error
>();

export const editCategoryAsync = createAsyncAction(EDIT_CATEGORY, EDIT_CATEGORY_SUCCESS, EDIT_CATEGORY_ERROR)<
    Omit<Category, "products">,
    Omit<Category, "products" | "lexoRank">,
    Error
>();

export const moveCategoryAsync = createAsyncAction(MOVE_CATEGORY, MOVE_CATEGORY_SUCCESS, MOVE_CATEGORY_ERROR)<
    { srcIdx: number; destIdx: number },
    Category[],
    Error
>();

export const removeCategoryAsync = createAsyncAction(REMOVE_CATEGORY, REMOVE_CATEGORY_SUCCESS, REMOVE_CATEGORY_ERROR)<
    number,
    number,
    Error
>();

export const addProductAsync = createAsyncAction(ADD_PRODUCT, ADD_PRODUCT_SUCCESS, ADD_PRODUCT_ERROR)<
    { name: string; price: number; categoryIdx: number },
    Product,
    Error
>();

export const editProductAsync = createAsyncAction(EDIT_PRODUCT, EDIT_PRODUCT_SUCCESS, EDIT_PRODUCT_ERROR)<
    Product,
    Product,
    Error
>();

function* getCategoriesSaga(action: ReturnType<typeof getCategoriesAsync.request>) {
    try {
        const categories: Category[] = yield call(getCategories);
        categories.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
        yield put(getCategoriesAsync.success(categories));
    } catch (e) {
        yield put(getCategoriesAsync.failure(e));
    }
}

function* addCategorySaga(action: ReturnType<typeof addCategoryAsync.request>) {
    try {
        // lexoRank 생성 로직
        const name = action.payload;
        const categories: Category[] = yield select((state: RootState) => state.product.categories.data);
        const lastIdx: number = yield call(addCategory, name, Z_LEXO_RANK);
        const clen = categories.length;
        const lastCategory = categories[clen - 1];
        if (clen === 1) {
            // 마지막 한칸 전이 없는 경우(길이 1)에는 'a' * defaultLexoRankLength 와 마지막의 중간값
            // DB 업데이트
            yield call(editCategory, lastCategory.idx, lastCategory.name, getRankBetween(A_LEXO_RANK, Z_LEXO_RANK));
            // redux store 업데이트
            yield put({
                type: CHANGE_CATEGORY_LEXO_RANK,
                payload: { index: clen - 1, lexoRank: getRankBetween(A_LEXO_RANK, Z_LEXO_RANK) },
            });
        } else if (clen !== 0) {
            // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
            // DB 업데이트
            yield call(
                editCategory,
                lastCategory.idx,
                lastCategory.name,
                getRankBetween(categories[clen - 2].lexoRank, Z_LEXO_RANK)
            );
            // redux store 업데이트
            yield put({
                type: CHANGE_CATEGORY_LEXO_RANK,
                payload: { index: clen - 1, lexoRank: getRankBetween(categories[clen - 2].lexoRank, Z_LEXO_RANK) },
            });
        }

        // 새로운 lexoRank는 기존의 마지막 lexoRank (= 'z'* defaultLexoRankLength),
        yield put(addCategoryAsync.success({ idx: lastIdx, name, lexoRank: Z_LEXO_RANK, products: [] }));
    } catch (e) {
        yield put(addCategoryAsync.failure(e));
    }
}

function* editCategorySaga(action: ReturnType<typeof editCategoryAsync.request>) {
    try {
        const { idx, name, lexoRank } = action.payload;
        yield call(editCategory, idx, name, lexoRank);
        yield put(editCategoryAsync.success({ idx, name }));
    } catch (e) {
        yield put(editCategoryAsync.failure(e));
    }
}

function* moveCategorySaga(action: ReturnType<typeof moveCategoryAsync.request>) {
    // 카테고리 옮기는 로직
    const { srcIdx, destIdx } = action.payload;
    // categories는 정렬돼있는 상태
    const categories: Category[] = JSON.parse(
        JSON.stringify(yield select((state: RootState) => state.product.categories.data))
    );
    const srcCategory = categories[srcIdx];
    const destCategory = categories[destIdx];
    let newLexoRank = "";
    try {
        if (srcIdx < destIdx) {
            if (destIdx === categories.length - 1) {
                // destCategory가 마지막 카테고리인 경우
                newLexoRank = getRankBetween(categories[destIdx - 1].lexoRank, Z_LEXO_RANK);
                // redux store 수정
                srcCategory.lexoRank = Z_LEXO_RANK;
                destCategory.lexoRank = newLexoRank;
            } else {
                // destCategory 뒤에 카테고리가 있는 경우
                newLexoRank = getRankBetween(categories[destIdx].lexoRank, categories[destIdx + 1].lexoRank);
                // redux store 수정
                srcCategory.lexoRank = newLexoRank;
            }
        } else {
            if (destIdx === 0) {
                // destCategory가 첫번째 카테고리인 경우
                newLexoRank = getRankBetween(A_LEXO_RANK, categories[destIdx + 1].lexoRank);
                // redux store 수정
                srcCategory.lexoRank = A_LEXO_RANK;
                destCategory.lexoRank = newLexoRank;
            } else {
                // destCategory 앞에 카테고리가 있는 경우
                newLexoRank = getRankBetween(categories[destIdx - 1].lexoRank, categories[destIdx].lexoRank);
                // redux store 수정
                srcCategory.lexoRank = newLexoRank;
            }
        }

        categories.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
        yield put(moveCategoryAsync.success(categories));

        // DB 수정 로직은 마지막에 함.
        // try 부분에서 yield call을 호출하면 렌더링이 한번 되는 현상이 발생해서
        // 옮긴 위치로 정렬되기 전 리스트가 불필요하게 한 번 더 렌더링 됨.
        if (srcIdx < destIdx) {
            if (destIdx === categories.length - 1) {
                // destCategory가 마지막 카테고리인 경우
                yield call(editCategory, srcCategory.idx, srcCategory.name, Z_LEXO_RANK);
                yield call(editCategory, destCategory.idx, destCategory.name, newLexoRank);
            } else {
                // destCategory 뒤에 카테고리가 있는 경우
                yield call(editCategory, srcCategory.idx, srcCategory.name, newLexoRank);
            }
        } else {
            if (destIdx === 0) {
                // destCategory가 첫번째 카테고리인 경우
                yield call(editCategory, srcCategory.idx, srcCategory.name, A_LEXO_RANK);
                yield call(editCategory, destCategory.idx, destCategory.name, newLexoRank);
            } else {
                // destCategory 앞에 카테고리가 있는 경우
                yield call(editCategory, srcCategory.idx, srcCategory.name, newLexoRank);
            }
        }
    } catch (e) {
        yield put(moveCategoryAsync.failure(e));
    }
}

function* removeCategorySaga(action: ReturnType<typeof removeCategoryAsync.request>) {
    try {
        const idx = action.payload;
        yield call(removeCategory, idx);
        yield put(removeCategoryAsync.success(idx));
    } catch (e) {
        yield put(removeCategoryAsync.failure(e));
    }
}

function* addProductSaga(action: ReturnType<typeof addProductAsync.request>) {
    try {
        // lexoRank 생성 로직
        const { categoryIdx, name, price } = action.payload;
        const categories: Category[] = yield select((state: RootState) => state.product.categories.data);
        const products = categories.find((category) => category.idx === categoryIdx)?.products;
        if (products) {
            const lastIdx = yield call(addProduct, name, price, categoryIdx, Z_LEXO_RANK);
            const plen = products.length;
            const lastProduct = products[plen - 1];

            if (plen === 1) {
                // 마지막 한칸 전이 없는경우(길이 1)에는 'a'* defaultLexoRankLength 와 마지막의 중간값
                const newLexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
                // DB
                yield call(editProduct, lastProduct.idx, lastProduct.name, lastProduct.price, newLexoRank);
                // redux store
                yield put({
                    type: CHANGE_PRODUCT_LEXO_RANK,
                    payload: { categoryIdx, index: plen - 1, lexoRank: newLexoRank },
                });
            } else if (plen !== 0) {
                // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
                const newLexoRank = getRankBetween(products[plen - 2].lexoRank, Z_LEXO_RANK);
                // DB
                yield call(editProduct, lastProduct.idx, lastProduct.name, lastProduct.price, newLexoRank);
                // redux store
                yield put({
                    type: CHANGE_PRODUCT_LEXO_RANK,
                    payload: {
                        categoryIdx,
                        index: plen - 1,
                        lexoRank: newLexoRank,
                    },
                });
            }
            // 새로운 lexoRank는 기존의 마지막 lexoRank (= 'z'* defaultLexoRankLength ),
            yield put(
                addProductAsync.success({
                    idx: lastIdx,
                    name,
                    price,
                    categoryIdx,
                    lexoRank: Z_LEXO_RANK,
                })
            );
        }
    } catch (e) {
        yield put(addProductAsync.failure(e));
    } finally {
    }
}

function* editProductSaga(action: ReturnType<typeof editProductAsync.request>) {
    try {
        const { idx, name, price, lexoRank } = action.payload;
        yield call(editProduct, idx, name, price, lexoRank);
        yield put(editProductAsync.success(action.payload));
    } catch (e) {
        yield put(editProductAsync.failure(e));
    }
}

export function* productSaga() {
    yield takeLatest(GET_CATEGORIES, getCategoriesSaga);
    yield takeEvery(ADD_CATEGORY, addCategorySaga);
    yield takeEvery(EDIT_CATEGORY, editCategorySaga);
    yield takeEvery(MOVE_CATEGORY, moveCategorySaga);
    yield takeEvery(REMOVE_CATEGORY, removeCategorySaga);
    yield takeEvery(ADD_PRODUCT, addProductSaga);
    yield takeEvery(EDIT_PRODUCT, editProductSaga);
}
