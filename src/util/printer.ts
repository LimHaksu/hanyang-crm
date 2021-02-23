import { PaperOption, PrintRowContent, ValueType } from "module/printer";
import { Order } from "module/order";
import { timeToFormatString } from "util/time";
import { PosPrintOptions } from "electron-pos-printer";

const { remote } = window.require("electron");
const { PosPrinter } = remote.require("electron-pos-printer");
const webContents = remote.getCurrentWebContents();

export const defaultPapersOptions = (): PaperOption[] => [
    {
        printAvailable: false,
        checkedList: [],
        customMessages: [],
    },
    {
        printAvailable: false,
        checkedList: [],
        customMessages: [],
    },
];
export const defaultPapersContents = (): PrintRowContent[][] => [[], []];
export interface Printer {
    name: string;
    description: string;
    status: number;
    isDefault: boolean;
    options: {
        "printer-make-and-model": string;
        system_driverinfo: string;
    };
}

type Key = "papersOptions" | "papersContents";
/**
 * 로컬스토리지 키 값으로 해당 아이템(Options 또는 Contents)을 가져옴
 * @param key 'papersOptions' | 'papersContents'
 */
export const getPapersLocalStorage = (key: Key) => {
    const paperslocalStorage = localStorage.getItem(key);
    if (paperslocalStorage) {
        switch (key) {
            case "papersOptions":
                return paperslocalStorage
                    ? (JSON.parse(paperslocalStorage) as ReturnType<typeof defaultPapersOptions>)
                    : defaultPapersOptions();
            case "papersContents":
                return paperslocalStorage
                    ? (JSON.parse(paperslocalStorage) as ReturnType<typeof defaultPapersContents>)
                    : defaultPapersContents();
        }
    }
};

export const getPrinters = () => {
    return webContents.getPrinters();
};

/**
 * 프린트 양식 HTML을 만들어줌
 * @param valueType orderNumber | paymentMethod | orderTime | address | phoneNumber | request | menu
 * @param orderIndex 주문 목록 상 순서
 * @param order 주문 객체중 valueType에 해당하는 속성만 Pick<Order>
 */
export const makeHTMLForm = (
    valueType: ValueType,
    orderIndex: number,
    order: Pick<
        Order,
        "paymentMethod" | "orderTime" | "address" | "phoneNumber" | "customerRequest" | "orderRequest" | "products"
    >
) => {
    switch (valueType) {
        case "orderNumber":
            return `<div style="font-size:1rem; font-weight:bold">순번 : ${orderIndex + 1}</div>`;
        case "paymentMethod":
            return `<div style="font-size:1.2rem; font-weight:bold; order-bottom:1px dashed;">${order.paymentMethod}</div>`;
        case "orderTime":
            return `<div>${timeToFormatString(order.orderTime)}</div>`;
        case "address":
            return `<div style="font-size:1.1rem;">주소 : <span style="font-weight:bold">${order.address}</span></div>`;
        case "phoneNumber":
            return `<div>연락처 : ${order.phoneNumber}</div>`;
        case "request":
            return `<div style="font-size:1.1rem; border-bottom:1px dashed;">요청사항 : <span style="font-weight:bold">${order.customerRequest} / ${order.orderRequest}</span></div>`;
        case "menu":
            return `<table style="border-top:1px solid; border-bottom:1px solid; text-align:center;">
                        <thead style="border-bottom:1px solid;">
                            <th>메뉴</th>
                            <th style="min-width:32px">수량</th>
                            <th>금액</th>
                        </thead>
                        <tbody>
                        ${order.products
                            .map((product) => {
                                const { name, price, amount } = product;
                                return `<tr style="font-size:1.1rem; border-bottom:1px dashed;">
                                <td>${name}</td>
                                <td style="${amount > 1 ? "font-weight:bold;" : ""}">${amount}</td>
                                <td style="${amount > 1 ? "font-weight:bold;" : ""}">${(
                                    price * amount
                                ).toLocaleString()}</td>
                                </tr>`;
                            })
                            .join("")}
                        <tr style="font-size:1.2rem; font-weight:bold; padding-top:5px">
                            <td>합계</td>
                            <td></td>
                            <td>${order.products
                                .reduce((acc, product) => acc + product.price * product.amount, 0)
                                .toLocaleString()}</td>
                        </tr>
                        </tbody>
                    </table>`;
        default:
            return `<div></div>`;
    }
};

/**
 * 주문정보, 출력할 항목, 출력 옵션을 입력하면 프린터를 호출하여 출력.
 * @param orderIndex 주문목록에서 주문 순서
 * @param order 주문 정보
 * @param printContents 출력할 항목
 * @param printerOption 출력 옵션
 */
export const print = (
    orderIndex: number,
    order: Pick<
        Order,
        "paymentMethod" | "orderTime" | "address" | "phoneNumber" | "customerRequest" | "orderRequest" | "products"
    >,
    printContents: PrintRowContent[],
    printerOption: PosPrintOptions
) => {
    // printContents 를 순회하며 printData를 만듦.
    // "순번" | "결제방법" | "주문시각" | "주소" | "연락처" | "요청사항" | "메뉴";
    const printData = printContents.map((printContent) => {
        const { valueType, value } = printContent;
        let newValue = value;
        if (valueType !== "text") {
            newValue = makeHTMLForm(valueType, orderIndex, order);
        }
        return { ...printContent, value: newValue };
    });
    try {
        PosPrinter.print(printData, printerOption);
    } catch (e) {
        alert(e);
    }
};
