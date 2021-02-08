import { CategoryType } from "./data";

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

export const reorderCategories = ({
    categories,
    source,
    destination,
}: {
    categories: CategoryType[];
    source: any;
    destination: any;
}) => {
    const currentIdx = categories.findIndex((category) => category.name === source.droppableId);
    const nextIdx = categories.findIndex((category) => category.name === destination.droppableId);
    const current = [...categories[currentIdx].products];
    const next = [...categories[nextIdx].products];
    const target = current[source.index];

    // moving to same list
    if (source.droppableId === destination.droppableId) {
        const reordered = reorder(current, source.index, destination.index);
        const result = [...categories];
        result[currentIdx].products = reordered;
        return result;
    }

    // moving to different list

    // remove from original
    current.splice(source.index, 1);
    // insert into next
    next.splice(destination.index, 0, target);

    const result = [...categories];
    result[currentIdx].products = current;
    result[nextIdx].products = next;
    return result;
};
