import { select, call, put, takeEvery } from "redux-saga/effects";
import { createAsyncAction } from "typesafe-actions";
import { addCategory, editCategory } from "db/product";
import { Category, CHANGE_CATEGORY_LEXO_RANK } from "module/product";
import { RootState } from "../index";
import { getRankBetween, A_LEXO_RANK, Z_LEXO_RANK } from "util/lexoRank";

export const ADD_CATEGORY = "product/ADD_CATEGORY";
export const ADD_CATEGORY_SUCCESS = "product/ADD_CATEGORY_SUCCESS";
export const ADD_CATEGORY_ERROR = "product/ADD_CATEGORY_ERROR";

export const EDIT_CATEGORY = "product/EDIT_CATEGORY";
export const EDIT_CATEGORY_SUCCESS = "product/EDIT_CATEGORY_SUCCESS";
export const EDIT_CATEGORY_ERROR = "product/EDIT_CATEGORY_ERROR";

// createAsyncAction : request, success, failure, cancel arg를 넣으면
// asyncAction을 만들어줌
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

export function* productSaga() {
    yield takeEvery(ADD_CATEGORY, addCategorySaga);
    yield takeEvery(EDIT_CATEGORY, editCategorySaga);
}
