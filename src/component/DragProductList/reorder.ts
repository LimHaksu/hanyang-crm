/**
 * list의 startIndex에 있는 요소를 endIndex 뒤로 옮김
 * @param list
 * @param startIndex
 * @param endIndex
 */
const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export default reorder;
