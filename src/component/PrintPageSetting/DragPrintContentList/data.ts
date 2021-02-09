type typeType = "text" | "barCode" | "qrCode" | "image" | "table";
type cssType = { [key: string]: string };
type positionType = "left" | "center" | "right";
type valueTypeType =
    | "orderNumber"
    | "paymentMethod"
    | "orderTime"
    | "address"
    | "phoneNumber"
    | "request"
    | "menu"
    | "text";
/**
 *  valueType 이 text 인 경우에는 value 출력, 이외에는 주문정보 가져와서 출력
 */
export interface contentType {
    idx: number;
    type: typeType;
    value: string;
    valueType: valueTypeType;
    style?: string;
    css?: { [key: string]: string };
    path?: string;
    position?: "left" | "center" | "right"; // position of image
    width?: string; // width of image in px; default: auto
    height?: string; // height of image in px; default: 50 or '50px'
    displayValue?: boolean; // Display value below barcode
    fontSize?: number;
}

const createContent = (
    idx: number,
    type: typeType,
    value: string,
    valueType: valueTypeType,
    css: cssType,
    position: positionType = "center"
): contentType => {
    return {
        idx,
        type,
        value,
        valueType,
        css,
        position,
    };
};

export const contents = [
    createContent(0, "text", "[[[ 순번 ]]]", "orderNumber", {}),
    createContent(1, "text", "[[[ 결제방법 ]]]", "paymentMethod", {}),
    createContent(2, "text", "[[[ 주문시각 ]]]", "orderTime", {}),
    createContent(3, "text", "[[[ 주소 ]]]", "address", {}),
    createContent(4, "text", "[[[ 연락처 ]]]", "phoneNumber", {}),
    createContent(5, "text", "[[[ 요청사항 ]]]", "request", {}),
    createContent(6, "text", "[[[ 메뉴 ]]]", "menu", {}),
];
