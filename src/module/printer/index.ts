import { createAction, ActionType, createReducer } from "typesafe-actions";
import produce from "immer";
import { defaultPapersContents, defaultPapersOptions, getPapersLocalStorage } from "util/printer";
import { PosPrintOptions } from "electron-pos-printer";

export type Type = "text" | "barCode" | "qrCode" | "image" | "table";
export type CSS = { [key: string]: string };
export type Position = "left" | "center" | "right";
export type Name = "순번" | "결제방법" | "주문시각" | "주소" | "연락처" | "요청사항" | "메뉴";
export type ValueType =
    | "orderNumber"
    | "paymentMethod"
    | "orderTime"
    | "address"
    | "phoneNumber"
    | "request"
    | "menu"
    | "text";

//
export interface PrintRowContent {
    type: Type;
    /** valueType 이 text 인 경우에는 value 출력, 이외에는 주문정보 가져와서 출력 */
    valueType: ValueType;
    /** 출력할 내용 */
    value: string;
    /** 출력 프리뷰에서 보여지는 항목 (순번, 결제방법, ... , 요청사항, 메뉴) */
    name?: Name;
    /** inline style ex:`text-align:center;` */
    style?: string;
    /** ex: { "font-weight": "700", "font-size": "18px" } */
    css?: CSS;
    /** image file path */
    path?: string;
    /** position of image */
    position?: Position;
    /** width of image in px; default: auto */
    width?: string;
    /** height of image in px; default: 50 or '50px' */
    height?: string;
    /** Display value below barcode */
    displayValue?: boolean;
    fontSize?: number;
}

const SET_CURRENT_PAPER_INDEX = "printer/SET_CURRENT_PAPER_INDEX";
const SET_PAPERS_OPTIONS = "printer/SET_PAPERS_OPTIONS";
const SET_PAPERS_CONTENTS = "printer/SET_PAPERS_CONTENTS";
const SET_PRINTER_OPTION = "printer/SET_PRINTER_OPTION";
const TOGGLE_PRINT_AVAILABLE = "printer/TOGGLE_PRINT_AVAILABLE";
const TOGGLE_CHECK_ITEM = "printer/TOGGLE_CHECK_ITEM";
const SET_SELECTED_PRINTER = "printer/SET_SELECTED_PRINTER";
const ADD_PAPER_CONTENT = "printer/ADD_PAPER_CONTENT";
const REMOVE_PAPER_CONTENT = "printer/REMOVE_PAPER_CONTENT";
const REORDER_PAPER_CONTENTS = "printer/REORDER_PAPER_CONTENTS";

export const GET_PHONE_CALL_RECORDS = "phone/GET_PHONE_CALL_RECORDS";
export const GET_PHONE_CALL_RECORDS_SUCCESS = "phone/GET_PHONE_CALL_RECORDS_SUCCESS";
export const GET_PHONE_CALL_RECORDS_ERROR = "phone/GET_PHONE_CALL_RECORDS_ERROR";

export const setCurrentPaperIndexAction = createAction(SET_CURRENT_PAPER_INDEX, (paperIndex: number) => paperIndex)();

export const setPapersOptionsAction = createAction(SET_PAPERS_OPTIONS)<[PaperOption, PaperOption]>();

export const setPapersContentsAction = createAction(SET_PAPERS_CONTENTS)<[PrintRowContent[], PrintRowContent[]]>();

export const setPrinterOptionAction = createAction(SET_PRINTER_OPTION)<PosPrintOptions>();

export const togglePrintAvailableAction = createAction(
    TOGGLE_PRINT_AVAILABLE,
    (paperIndex: number, printAvailable) => ({
        paperIndex,
        printAvailable,
    })
)();

export const toggleCheckItemAction = createAction(TOGGLE_CHECK_ITEM, (paperIndex: number, item: CheckItem) => ({
    paperIndex,
    item,
}))();

export const setSelectedPrinterAction = createAction(
    SET_SELECTED_PRINTER,
    (selectedPrinter: string) => selectedPrinter
)();

export const addPaperContentAction = createAction(
    ADD_PAPER_CONTENT,
    (paperIndex: number, content: PrintRowContent) => ({ paperIndex, content })
)();

export const removePaperContentAction = createAction(
    REMOVE_PAPER_CONTENT,
    (paperIndex: number, contentIndex: number) => ({ paperIndex, contentIndex })
)();

export const reorderPaperContentsAction = createAction(
    REORDER_PAPER_CONTENTS,
    (paperIndex: number, srcIndex: number, destIndex: number) => ({ paperIndex, srcIndex, destIndex })
)();

const actions = {
    setCurrentPaperIndexAction,
    setPapersOptionsAction,
    setPapersContentsAction,
    setPrinterOptionAction,
    togglePrintAvailableAction,
    toggleCheckItemAction,
    setSelectedPrinterAction,
    addPaperContentAction,
    removePaperContentAction,
    reorderPaperContentsAction,
};

export interface CheckItem {
    name: Name;
    value: ValueType;
}

export interface PaperOption {
    printAvailable: boolean;
    checkedList: CheckItem[];
    customMessages: string[];
}

export interface PrinterState {
    selectedPrinter: string;
    papersOptions: PaperOption[];
    papersContents: PrintRowContent[][];
    printerOption: PosPrintOptions;
    currentPaperIndex: number;
}

const initialState: PrinterState = {
    selectedPrinter: "",
    papersOptions: defaultPapersOptions(),
    papersContents: defaultPapersContents(),
    printerOption: {
        preview: false, // Preview in window or print
        width: "300px", //  width of content body
        margin: "10px 0 0 0", // margin of content body
        copies: 1, // Number of copies to print
        printerName: "", // printerName: string, check it at webContent.getPrinters()
        timeOutPerLine: 400,
        silent: true,
    },
    currentPaperIndex: 0,
};

type PrinterAction = ActionType<typeof actions>;

const printer = createReducer<PrinterState, PrinterAction>(initialState, {
    [SET_CURRENT_PAPER_INDEX]: (state, { payload: currentPaperIndex }) => ({ ...state, currentPaperIndex }),
    [SET_PAPERS_OPTIONS]: (state, { payload: papersOptions }) => ({ ...state, papersOptions }),
    [SET_PAPERS_CONTENTS]: (state, { payload: papersContents }) => ({ ...state, papersContents }),
    [SET_PRINTER_OPTION]: (state, { payload: printerOption }) => ({ ...state, printerOption }),
    [TOGGLE_PRINT_AVAILABLE]: (state, { payload: { paperIndex, printAvailable } }) =>
        produce(state, (draft) => {
            const newPapersOptionsLocalStorage = getPapersLocalStorage("papersOptions") as PaperOption[];

            draft.papersOptions[paperIndex].printAvailable = printAvailable;
            newPapersOptionsLocalStorage[paperIndex].printAvailable = printAvailable;
            localStorage.setItem("papersOptions", JSON.stringify(newPapersOptionsLocalStorage));
        }),
    [TOGGLE_CHECK_ITEM]: (state, { payload: { paperIndex, item } }) =>
        produce(state, (draft) => {
            const newPapersOptionsLocalStorage = getPapersLocalStorage("papersOptions") as PaperOption[];
            const newPapersContentsLocalStorage = getPapersLocalStorage("papersContents") as PrintRowContent[][];

            const checkedList = draft.papersOptions[paperIndex].checkedList;
            const foundIndex = checkedList.findIndex((checkItem) => checkItem.value === item.value);
            const contents = draft.papersContents[paperIndex];
            if (foundIndex >= 0) {
                checkedList.splice(foundIndex, 1);
                const newContents = contents.filter((content) => content.valueType !== item.value);
                draft.papersContents[paperIndex] = newContents;
                // localStorage도 변경
                newPapersOptionsLocalStorage[paperIndex].checkedList.splice(foundIndex, 1);
                newPapersContentsLocalStorage[paperIndex] = newContents;
            } else {
                checkedList.push(item);
                const newContent = {
                    type: "text" as Type,
                    valueType: item.value,
                    value: "",
                    name: item.name,
                };
                contents.push(newContent);
                // localStorage도 변경
                newPapersOptionsLocalStorage[paperIndex].checkedList.push(item);
                newPapersContentsLocalStorage[paperIndex].push(newContent);
            }
            localStorage.setItem("papersOptions", JSON.stringify(newPapersOptionsLocalStorage));
            localStorage.setItem("papersContents", JSON.stringify(newPapersContentsLocalStorage));
        }),
    [SET_SELECTED_PRINTER]: (state, { payload: selectedPrinter }) =>
        produce(state, (draft) => {
            if (selectedPrinter === "") {
                localStorage.removeItem("selectedPrinter");
            } else {
                localStorage.setItem("selectedPrinter", selectedPrinter);
            }
            draft.selectedPrinter = selectedPrinter;
            draft.printerOption.printerName = selectedPrinter;
        }),
    [ADD_PAPER_CONTENT]: (state, { payload: { paperIndex, content } }) =>
        produce(state, (draft) => {
            const newPapersContentsLocalStorage = getPapersLocalStorage("papersContents") as PrintRowContent[][];
            newPapersContentsLocalStorage[paperIndex].push(content);
            localStorage.setItem("papersContents", JSON.stringify(newPapersContentsLocalStorage));

            draft.papersContents[paperIndex].push(content);
        }),
    [REMOVE_PAPER_CONTENT]: (state, { payload: { paperIndex, contentIndex } }) =>
        produce(state, (draft) => {
            const newPapersContentsLocalStorage = getPapersLocalStorage("papersContents");
            if (newPapersContentsLocalStorage) {
                (newPapersContentsLocalStorage[paperIndex] as PrintRowContent[]).splice(contentIndex, 1);
                localStorage.setItem("papersContents", JSON.stringify(newPapersContentsLocalStorage));
            }

            draft.papersContents[paperIndex].splice(contentIndex, 1);
        }),
    [REORDER_PAPER_CONTENTS]: (state, { payload: { paperIndex, srcIndex, destIndex } }) =>
        produce(state, (draft) => {
            const contents = draft.papersContents[paperIndex];
            const [removed] = contents.splice(srcIndex, 1);
            contents.splice(destIndex, 0, removed);

            const newPapersContentsLocalStorage = getPapersLocalStorage("papersContents") as PrintRowContent[][];
            if (newPapersContentsLocalStorage) {
                const contents = newPapersContentsLocalStorage[paperIndex] as PrintRowContent[];
                const [removed] = contents.splice(srcIndex, 1);
                contents.splice(destIndex, 0, removed);
                localStorage.setItem("papersContents", JSON.stringify(newPapersContentsLocalStorage));
            }
        }),
});

export default printer;
