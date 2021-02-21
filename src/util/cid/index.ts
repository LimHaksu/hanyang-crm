const HID = window.require("node-hid");
export const supportedDevices = ["PCCALL Ver-1.0"];

/**
 * 현재 등록된 기기 목록 가져오기
 */
export const getDevices = () => {
    return HID.devices();
};
