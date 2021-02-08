export interface ProductType {
    idx: number;
    name: string;
    price: number;
    previousProductIdx: number | null;
}

export interface CategoryType {
    idx: number;
    name: string;
    products: ProductType[];
    previousCategoryIdx: number | null;
}

const createCategory = (
    idx: number,
    name: string,
    products: ProductType[],
    previousCategoryIdx: number | null = null
) => {
    return {
        idx,
        name,
        products,
        previousCategoryIdx,
    };
};

export const categories = [
    createCategory(0, "족발", [
        { idx: 0, name: "1인족발", price: 20000, previousProductIdx: null },
        { idx: 1, name: "족발小", price: 30000, previousProductIdx: 0 },
    ]),
    createCategory(
        1,
        "보쌈",
        [
            { idx: 2, name: "1인보쌈", price: 20000, previousProductIdx: null },
            {
                idx: 3,
                name: "보쌈小",
                price: 30000,
                previousProductIdx: 2,
            },
        ],
        0
    ),
    createCategory(
        2,
        "추가메뉴",
        [
            { idx: 4, name: "콜라", price: 3000, previousProductIdx: null },
            { idx: 5, name: "사이다", price: 3000, previousProductIdx: 4 },
        ],
        1
    ),
    createCategory(
        3,
        "할인",
        [
            { idx: 6, name: "내방객", price: -3000, previousProductIdx: null },
            { idx: 7, name: "쿠폰", price: -2000, previousProductIdx: 6 },
        ],
        2
    ),
];
