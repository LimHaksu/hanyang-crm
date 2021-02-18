export const getSnakeCase = (camelCase: string) => {
    return camelCase.replace(/[A-Z]/g, (a) => `_${a.toLowerCase()}`);
};

export const getCamelCase = (snake_case: string) => {
    return snake_case.replace(/_[a-z]/g, (a) => a.substring(1, 2).toUpperCase());
};
