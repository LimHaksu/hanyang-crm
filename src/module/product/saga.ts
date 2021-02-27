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
        const lastIdx: number = yield call(addCategory, name, Z_LEXO_RANK);
        const clen = categories.length;
        const lastCategory = categories[clen - 1];
        if (clen === 1) {
            // 마지막 한칸 전이 없는 경우(길이 1)에는 'a' * defaultLexoRankLength 와 마지막의 중간값
            const newLexoRank = getRankBetween(A_LEXO_RANK, Z_LEXO_RANK);
            // DB 업데이트
            yield call(editCategory, lastCategory.idx, lastCategory.name, newLexoRank);
            // redux store 업데이트
            yield put({
                type: CHANGE_CATEGORY_LEXO_RANK,
                payload: { index: clen - 1, lexoRank: newLexoRank },
            });
        } else if (clen !== 0) {
            // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
            const newLexoRank = getRankBetween(categories[clen - 2].lexoRank, Z_LEXO_RANK);
            // DB 업데이트
            yield call(editCategory, lastCategory.idx, lastCategory.name, newLexoRank);
            // redux store 업데이트
            yield put({
                type: CHANGE_CATEGORY_LEXO_RANK,
                payload: { index: clen - 1, lexoRank: newLexoRank },
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
    let srcNewRank = "";
    let destNewRank = "";
    try {
        if (srcIdx < destIdx) {
            // 위에서 아래로 이동
            if (destIdx === categories.length - 1) {
                // destCategory가 마지막 카테고리인 경우
                destCategory.lexoRank = destNewRank = getRankBetween(categories[destIdx - 1].lexoRank, Z_LEXO_RANK);
                srcCategory.lexoRank = srcNewRank = Z_LEXO_RANK;
            } else {
                // destCategory 뒤에 카테고리가 있는 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(
                    categories[destIdx].lexoRank,
                    categories[destIdx + 1].lexoRank
                );
            }
        } else {
            // 아래에서 위로 이동
            if (destIdx === 0) {
                // destCategory가 첫번째 카테고리인 경우
                destCategory.lexoRank = destNewRank = getRankBetween(A_LEXO_RANK, categories[destIdx + 1].lexoRank);
                srcCategory.lexoRank = srcNewRank = A_LEXO_RANK;
            } else {
                // destCategory 앞에 카테고리가 있는 경우
                srcCategory.lexoRank = srcNewRank = getRankBetween(
                    categories[destIdx - 1].lexoRank,
                    categories[destIdx].lexoRank
                );
            }
        }

        categories.sort((a, b) => (a.lexoRank < b.lexoRank ? -1 : 1));
        yield put(moveCategoryAsync.success(categories));

        // DB 수정 로직은 마지막에 함.
        // try 부분에서 yield call을 호출하면 렌더링이 한번 되는 현상이 발생해서
        // 옮긴 위치로 정렬되기 전 리스트가 불필요하게 한 번 더 렌더링 됨.
        yield call(editCategory, srcCategory.idx, srcCategory.name, srcNewRank);
        if ((srcIdx < destIdx && destIdx === categories.length - 1) || (srcIdx > destIdx && destIdx === 0)) {
            // 위에서 아래로 이동 ,destCategory가 마지막 카테고리인 경우
            // 아래에서 위로 이동, destCategory가 첫번째 카테고리인 경우
            yield call(editCategory, destCategory.idx, destCategory.name, destNewRank);
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
                yield call(
                    editProduct,
                    lastProduct.idx,
                    lastProduct.name,
                    lastProduct.price,
                    newLexoRank,
                    lastProduct.categoryIdx
                );
                // redux store
                yield put({
                    type: CHANGE_PRODUCT_LEXO_RANK,
                    payload: { categoryIdx, index: plen - 1, lexoRank: newLexoRank },
                });
            } else if (plen !== 0) {
                // 기존의 마지막 lexoRank는 마지막 한칸 전과 마지막의 중간 값
                const newLexoRank = getRankBetween(products[plen - 2].lexoRank, Z_LEXO_RANK);
                // DB
                yield call(
                    editProduct,
                    lastProduct.idx,
                    lastProduct.name,
                    lastProduct.price,
                    newLexoRank,
                    lastProduct.categoryIdx
                );
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
            JSON.stringify(yield select((state: RootState) => state.product.categories.data))
        );

        // 같은 카테고리 내에서 이동
        if (currentIndex === nextIndex) {
            const products = categories[currentIndex].products;
            const srcProduct = products[srcIdx];
            const destProduct = products[destIdx];
            let srcNewRank = "";
            let destNewRank = "";
            if (srcIdx < destIdx) {
                if (destIdx === products.length - 1) {
                    // destProduct가 마지막 상품인 경우
                    // destIdx - 1 === srcIdx일 수도 있기 때문에 destIdx 먼저 바꿔줘야함.
                    products[destIdx].lexoRank = destNewRank = getRankBetween(
                        products[destIdx - 1].lexoRank,
                        Z_LEXO_RANK
                    );
                    products[srcIdx].lexoRank = srcNewRank = Z_LEXO_RANK;
                } else {
                    // destProduct 뒤에 상품이 있는 경우
                    products[srcIdx].lexoRank = srcNewRank = getRankBetween(
                        products[destIdx].lexoRank,
                        products[destIdx + 1].lexoRank
                    );
                }
            } else {
                if (destIdx === 0) {
                    // destProduct가 첫번째 상품인 경우
                    // destIdx + 1 === srcIdx일 수도 있기 때문에 destIdx 먼저 바꿔줘야 함.
                    products[destIdx].lexoRank = destNewRank = getRankBetween(
                        A_LEXO_RANK,
                        products[destIdx + 1].lexoRank
                    );
                    products[srcIdx].lexoRank = srcNewRank = A_LEXO_RANK;
                } else {
                    // destProduct 앞에 상품이 있는 경우
                    products[srcIdx].lexoRank = srcNewRank = getRankBetween(
                        products[destIdx - 1].lexoRank,
                        products[destIdx].lexoRank
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
            if ((srcIdx < destIdx && destIdx === products.length - 1) || (srcIdx > destIdx && destIdx === 0)) {
                // 위에서 아래로 이동한 경우에는 마지막으로 이동할때만,
                // 아래에서 위로 이동한 경우에는 첫번째로 이동할때만 destProduct.lexoRank 업데이트
                yield call(
                    editProduct,
                    destProduct.idx,
                    destProduct.name,
                    destProduct.price,
                    destNewRank,
                    destProduct.categoryIdx
                );
            }
        } else {
            // 다른 카테고리로 이동
            const [srcProduct] = categories[currentIndex].products.splice(srcIdx, 1);
            const destProducts = categories[nextIndex].products;
            let destProduct = destProducts[destIdx];
            const destProductsLength = destProducts.length;
            let srcNewRank = "";
            let destNewRank = "";
            if (destProductsLength === 0) {
                // destProducts가 비어있는 경우
                srcProduct.lexoRank = srcNewRank = Z_LEXO_RANK;
            } else if (destProductsLength === 1) {
                // destProducts에 하나만 있는 경우
                if (destIdx === 0) {
                    // 첫번째로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = A_LEXO_RANK;
                    destProduct.lexoRank = destNewRank = Z_LEXO_RANK;
                } else {
                    // 마지막으로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = Z_LEXO_RANK;
                    destProduct = destProducts[destIdx - 1];
                    destProduct.lexoRank = destNewRank = A_LEXO_RANK;
                }
            } else if (destProductsLength > 1) {
                // destProducts에 두개 이상 있는 경우
                if (destIdx === 0) {
                    // 첫번째로 이동한 경우
                    destProduct.lexoRank = destNewRank = getRankBetween(
                        destProducts[destIdx].lexoRank,
                        destProducts[destIdx + 1].lexoRank
                    );
                    srcProduct.lexoRank = srcNewRank = A_LEXO_RANK;
                } else if (destIdx === destProductsLength) {
                    // 마지막으로 이동한 경우
                    // destProducts의 길이 이후에 붙이는 것이기때문에 destProductsLength-1을 안함
                    srcProduct.lexoRank = srcNewRank = Z_LEXO_RANK;
                    destProduct = destProducts[destIdx - 1];
                    destProduct.lexoRank = destNewRank = getRankBetween(
                        destProducts[destIdx - 2].lexoRank,
                        destProducts[destIdx - 1].lexoRank
                    );
                } else {
                    // 중간으로 이동한 경우
                    srcProduct.lexoRank = srcNewRank = getRankBetween(
                        destProducts[destIdx - 1].lexoRank,
                        destProducts[destIdx].lexoRank
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
            if (
                destProductsLength === 1 ||
                (destProductsLength > 1 && (destIdx === 0 || destIdx === destProductsLength))
            ) {
                // destProducts에 하나만 있는 경우.
                // 또는, destProducts에 두개 이상 있고, 첫번째 또는 마지막으로 이동
                yield call(
                    editProduct,
                    destProduct.idx,
                    destProduct.name,
                    destProduct.price,
                    destNewRank,
                    categories[nextIndex].idx
                );
            }
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
