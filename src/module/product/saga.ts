import { select, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import {
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
    addProduct,
    editProduct,
    removeProduct,
} from "db/product";
import { RootState } from "../index";
import { getRankBetween, A_LEXO_RANK, Z_LEXO_RANK } from "util/lexoRank";
import {
    Category,
    Product,
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
    MOVE_PRODUCT,
    MOVE_PRODUCT_SUCCESS,
    MOVE_PRODUCT_ERROR,
    REMOVE_PRODUCT,
    REMOVE_PRODUCT_SUCCESS,
    REMOVE_PRODUCT_ERROR,
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

export const moveProductAsync = createAsyncAction(MOVE_PRODUCT, MOVE_PRODUCT_SUCCESS, MOVE_PRODUCT_ERROR)<
    { currentIndex: number; nextIndex: number; srcIdx: number; destIdx: number },
    Category[],
    Error
>();

export const removeProductAsync = createAsyncAction(REMOVE_PRODUCT, REMOVE_PRODUCT_SUCCESS, REMOVE_PRODUCT_ERROR)<
    number,
    number,
    Error
>();

function* getCategoriesSaga(action: ReturnType<typeof getCategoriesAsync.request>) {
    try {
        const categories: Category[] = yield call(getCategories);
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
        const clen = categories.length;
        let lastIdx = -1;
        let newLexoRank = "";
        if (clen === 0) {
            // 카테고리가 없는경우
            // 새로운 lexoRank는 'a'.repeat() 과 'z'.repeat() 의 중간 값
            newLexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
        } else {
            // 카테고리가 있는 경우
            const lastCategory = categories[clen - 1];
            // 새로운 lexoRank는 기존 마지막 카테고리의 lexoRank와 'z'.repeat()의 중간값
            newLexoRank = getRankBetween(lastCategory.lexoRank, Z_LEXO_RANK);
        }
        lastIdx = yield call(addCategory, name, newLexoRank);

        if (lastIdx !== -1 && newLexoRank !== "") {
            yield put(addCategoryAsync.success({ idx: lastIdx, name, lexoRank: newLexoRank, products: [] }));
        } else {
            throw Error("카테고리 생성 실패");
        }
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
        JSON.stringify((yield select((state: RootState) => state.product.categories.data)) as Category[])
    ); // ReadOnly 상태를 제거하기 위하여 JSON.stringify후 다시 parse
    const srcCategory = categories[srcIdx];
    const destCategory = categories[destIdx];
    let srcNewRank = "";
    try {
        if (srcIdx < destIdx) {
            // 위에서 아래로 이동
            if (destIdx === categories.length - 1) {
                // destCategory가 마지막 카테고리인 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(destCategory.lexoRank, Z_LEXO_RANK);
            } else {
                // destCategory 뒤에 카테고리가 있는 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(
                    destCategory.lexoRank,
                    categories[destIdx + 1].lexoRank
                );
            }
        } else {
            // 아래에서 위로 이동
            if (destIdx === 0) {
                // destCategory가 첫번째 카테고리인 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(A_LEXO_RANK, destCategory.lexoRank);
            } else {
                // destCategory 앞에 카테고리가 있는 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(
                    categories[destIdx - 1].lexoRank,
                    destCategory.lexoRank
                );
            }
        }
        categories.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
        yield put(moveCategoryAsync.success(categories));

        // DB 수정 로직은 마지막에 함.
        // try 부분에서 yield call을 호출하면 렌더링이 한번 되는 현상이 발생해서
        // 옮긴 위치로 정렬되기 전 리스트가 불필요하게 한 번 더 렌더링 됨.
        yield call(editCategory, srcCategory.idx, srcCategory.name, srcNewRank);
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
            const plen = products.length;
            let newLexoRank = "";
            if (plen === 0) {
                // products가 없는경우 (카테고리가 비어있는경우)
                // 새로운 lexoRank는 'a'.repeat() 과 'z'.repeat() 의 중간 값
                newLexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
            } else {
                // 카테고리에 상품이 있는경우
                const lastProduct = products[plen - 1];
                newLexoRank = getRankBetween(lastProduct.lexoRank, Z_LEXO_RANK);
            }

            const lastIdx: number = yield call(addProduct, name, price, categoryIdx, newLexoRank);
            yield put(
                addProductAsync.success({
                    idx: lastIdx,
                    name,
                    price,
                    categoryIdx,
                    lexoRank: newLexoRank,
                })
            );
        } else {
            throw Error("카테고리에서 상품 조회 실패");
        }
    } catch (e) {
        yield put(addProductAsync.failure(e));
    } finally {
    }
}

function* editProductSaga(action: ReturnType<typeof editProductAsync.request>) {
    try {
        const { idx, name, price, lexoRank, categoryIdx } = action.payload;
        yield call(editProduct, idx, name, price, lexoRank, categoryIdx);
        yield put(editProductAsync.success(action.payload));
    } catch (e) {
        yield put(editProductAsync.failure(e));
    }
}

function* moveProductSaga(action: ReturnType<typeof moveProductAsync.request>) {
    try {
        const { currentIndex, nextIndex, srcIdx, destIdx } = action.payload;
        const categories: Category[] = JSON.parse(
            JSON.stringify((yield select((state: RootState) => state.product.categories.data)) as Category[])
        );

        // 같은 카테고리 내에서 이동
        if (currentIndex === nextIndex) {
            const products = categories[currentIndex].products;
            const srcProduct = products[srcIdx];
            const destProduct = products[destIdx];
            let srcNewRank = "";
            if (srcIdx < destIdx) {
                if (destIdx === products.length - 1) {
                    // destProduct가 마지막 상품인 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(destProduct.lexoRank, Z_LEXO_RANK);
                } else {
                    // destProduct 뒤에 상품이 있는 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(
                        destProduct.lexoRank,
                        products[destIdx + 1].lexoRank
                    );
                }
            } else {
                if (destIdx === 0) {
                    // destProduct가 첫번째 상품인 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(A_LEXO_RANK, destProduct.lexoRank);
                } else {
                    // destProduct 앞에 상품이 있는 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(
                        products[destIdx - 1].lexoRank,
                        destProduct.lexoRank
                    );
                }
            }
            // 정렬
            products.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
            yield put(moveProductAsync.success(categories));

            // DB 업데이트
            yield call(
                editProduct,
                srcProduct.idx,
                srcProduct.name,
                srcProduct.price,
                srcNewRank,
                srcProduct.categoryIdx
            );
        } else {
            // 다른 카테고리로 이동
            const [srcProduct] = categories[currentIndex].products.splice(srcIdx, 1);
            const destProducts = categories[nextIndex].products;
            const destProductsLength = destProducts.length;
            let srcNewRank = "";
            if (destProductsLength === 0) {
                // destProducts가 비어있는 경우
                srcProduct.lexoRank = srcNewRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
            } else if (destProductsLength === 1) {
                // destProducts에 하나만 있는 경우
                const destProduct = destProducts[0];
                if (destIdx === 0) {
                    // 첫번째로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(A_LEXO_RANK, destProduct.lexoRank);
                } else {
                    // 마지막으로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(destProduct.lexoRank, Z_LEXO_RANK);
                }
            } else if (destProductsLength > 1) {
                // destProducts에 두개 이상 있는 경우
                const destProduct = destProducts[destIdx];
                if (destIdx === 0) {
                    // 첫번째로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(A_LEXO_RANK, destProduct.lexoRank);
                } else if (destIdx === destProductsLength) {
                    // destProducts의 길이 이후에 붙이는 것이기때문에 destProductsLength-1을 안함
                    // 마지막으로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(
                        destProducts[destProducts.length - 1].lexoRank,
                        Z_LEXO_RANK
                    );
                } else {
                    // 중간으로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(
                        destProducts[destIdx - 1].lexoRank,
                        destProduct.lexoRank
                    );
                }
            }
            destProducts.push(srcProduct);
            destProducts.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
            yield put(moveProductAsync.success(categories));

            // DB 수정
            yield call(
                editProduct,
                srcProduct.idx,
                srcProduct.name,
                srcProduct.price,
                srcNewRank,
                categories[nextIndex].idx
            );
        }
    } catch (e) {
        yield put(moveCategoryAsync.failure(e));
    }
}

function* removeProductSaga(action: ReturnType<typeof removeProductAsync.request>) {
    try {
        const idx = action.payload;
        yield call(removeProduct, idx);
        yield put(removeProductAsync.success(idx));
    } catch (e) {
        yield put(removeProductAsync.failure(e));
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
    yield takeEvery(MOVE_PRODUCT, moveProductSaga);
    yield takeEvery(REMOVE_PRODUCT, removeProductSaga);
}
