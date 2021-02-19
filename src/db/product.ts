import { insert, select, update, deleteQuery, Category, Product } from "./db";
import { changePropertyFromSnakeToCamel } from "util/db";

/**
 * 새로운 카테고리 저장, 마지막 카테고리 lexoRank의 다음 문자열을 lexoRank로 받음
 * @param name 카테고리 이름
 * @param lexoRank 정렬을 위한 랭크 필드 (알파벳 소문자)
 */
export const addCategory = async (name: string, lexoRank: string) => {
    try {
        const query = `INSERT INTO
        category(name, lexo_rank)
        VALUES(?,?);`;
        const lastIdx = await insert(query, name, lexoRank);
        return lastIdx;
    } catch (e) {
        throw e;
    }
};

/**
 * 카테고리 리스트 반환, 각 카테고리는 상품 리스트를 갖고있음
 */
export const getCategories = async () => {
    try {
        // 카테고리 리스트 가져오기
        const querySelectCategory = `SELECT idx, name, lexo_rank
        FROM category`;
        const categories = await select<Category>(querySelectCategory);

        // 카테고리 리스트의 각 카테고리에 대해서 상품 리스트 추가하기
        const querySelectProductByCategoryIdx = `SELECT idx, name, price, lexo_rank, category_idx
        FROM product
        WHERE category_idx = ?`;
        const categoriesWithProducts = await Promise.all(
            categories.map(async (category) => {
                const products = await select<Product>(querySelectProductByCategoryIdx, category.idx);
                return { ...category, products };
            })
        );
        return changePropertyFromSnakeToCamel(categoriesWithProducts);
    } catch (e) {
        throw e;
    }
};

/**
 * 카테고리 이름 또는 위치 수정
 * @param idx 수정할 카테고리 idx
 * @param name 카테고리 이름
 * @param lexoRank 정렬을 위한 랭크 필드 (알파벳 소문자)
 */
export const editCategory = async (idx: number, name: string, lexoRank: string) => {
    try {
        const query = `UPDATE category
        SET name = ? , lexo_rank = ?
        WHERE idx = ?;`;
        await update(query, name, lexoRank, idx);
    } catch (e) {
        throw e;
    }
};

/**
 * 카테고리 idx를 입력하면 해당 카테고리 삭제, 하위 상품이 있을경우 에러 반환
 * @param idx 삭제할 카테고리 idx
 */
export const removeCategory = async (idx: number) => {
    try {
        const query = `DELETE
        FROM category
        WHERE idx = ?`;
        await deleteQuery(query, idx);
    } catch (e) {
        throw e;
    }
};

/**
 * 상품 정보를 입력하면 해당 상품을 카테고리에 추가
 * @param name 상품 이름
 * @param price 상품 가격
 * @param categoryIdx 상품이 소속된 카테고리 idx
 * @param lexoRank 정렬을 위한 랭크 필드 (알파벳 소문자)
 */
export const addProduct = async (name: string, price: number, categoryIdx: number, lexoRank: string) => {
    try {
        const query = `INSERT INTO
        product(name, price, category_idx, lexo_rank)
        VALUES(?,?,?,?);`;
        const lastId = await insert(query, name, price, categoryIdx, lexoRank);
        return lastId;
    } catch (e) {
        throw e;
    }
};

/**
 * 상품 정보를 수정
 * @param idx 수정할 상품의 idx
 * @param name 상품 이름
 * @param price 상품 가격
 * @param lexoRank 정렬을 위한 랭크 필드 (알파벳 소문자)
 * @param categoryIdx 상품이 소속된 카테고리 idx
 */
export const editProduct = async (idx: number, name: string, price: number, lexoRank: string, categoryIdx: number) => {
    try {
        const query = `UPDATE product
        SET name = ?, price = ?, lexo_rank = ?, category_idx = ?
        WHERE idx = ?;`;
        await update(query, name, price, lexoRank, categoryIdx, idx);
    } catch (e) {
        throw e;
    }
};

/**
 * 상품 정보를 삭제
 * @param idx 삭제할 상품의 idx
 */
export const removeProduct = async (idx: number) => {
    try {
        const query = `DELETE FROM product
        WHERE idx = ?;`;
        await deleteQuery(query, idx);
    } catch (e) {
        throw e;
    }
};
