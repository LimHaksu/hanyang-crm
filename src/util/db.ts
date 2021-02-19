export const getSnakeCaseString = (camelCase: string) => {
    return camelCase.replace(/[A-Z]/g, (a) => `_${a.toLowerCase()}`);
};

export const getCamelCaseString = (snake_case: string) => {
    return snake_case.replace(/_[a-z]/g, (a) => a.substring(1, 2).toUpperCase());
};

/**
 * db에서 가져온 결과값의 속성이 snake_case라면 이를 camelCase로 바꿔줌
 * key, value 전부 camelCase로 바꾸므로 사용시 주의
 * @param snake_case_obj JSON 형식의 객체
 */
export const changePropertyFromSnakeToCamel = (snake_case_obj: Object) => {
    return JSON.parse(getCamelCaseString(JSON.stringify(snake_case_obj)));
};
