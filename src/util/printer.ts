const { remote } = window.require("electron");

export interface printerType {
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
