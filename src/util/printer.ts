import { PaperOption, PrintRowContent } from "module/printer";

const { remote } = window.require("electron");
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

export const getPrinters = () => {
    const webContents = remote.getCurrentWebContents();
    return webContents.getPrinters();
};

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
