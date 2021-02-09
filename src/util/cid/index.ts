const HID = window.require("node-hid");
export const supportedDevices = ["PCCALL Ver-1.0"];

export interface deviceType {
    vendorId: number;
    productId: number;
    path: string; // 사용
    serialNumber: string;
    manufacturer: string; //사용, trinm() 필요
    product: string; //사용, trim() 필요
    release: number;
    interface: number;
    usagePage: number;
    usage: number;
}

export const getDevices = () => {
    return HID.devices();
};
};

