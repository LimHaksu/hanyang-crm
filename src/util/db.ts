export const getSnakeCaseString = (camelCase: string) => {
    return camelCase.replace(/[A-Z]/g, (a) => `_${a.toLowerCase()}`);
};

export const getCamelCaseString = (snake_case: string) => {
    return snake_case.replace(/_[a-z]/g, (a) => a.substring(1, 2).toUpperCase());
};

export const changePropertyFromSnakeToCamel = (snake_case_obj: Object) => {
    return JSON.parse(getCamelCaseString(JSON.stringify(snake_case_obj)));
};
