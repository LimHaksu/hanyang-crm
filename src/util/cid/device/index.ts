import pccallVer1 from "./PCCALL_VER-1.0";
import { Device } from "node-hid";

type callbackType = (data: Uint8Array) => string | undefined;

interface deviceFunctionMapType {
    [key: string]: callbackType | undefined;
}

const deviceFunctionMap: deviceFunctionMapType = {
    "PCCALL Ver-1.0": pccallVer1,
};

/**
 * 등록된 기기의 이름과 해당 기기에서 수신한 data를 입력 받으면 data를 기기에 형식에 맞게 decode 해서 전화번호를 리턴해줌
 * 등록된 기기가 아니라면 PCCALL Ver-1.0의 양식으로 시도해 봄
 * @param deviceName 기기의 이름
 * @param data 기기에서 수신한 데이터
 * @returns phoneNumber -(dash) 포함 문자열, 예)'010-1234-5678'
 */
export const getPhoneNumberFromDataByDevice = (deviceName: string, data: Uint8Array) => {
    const func = deviceFunctionMap[deviceName];
    if (func) {
        return func(data);
    }
    return pccallVer1(data);
};

/**
 * 기기 정보를 받아오면 기기의 이름을 리턴함.
 * 기기 이름이 없는 경우에는 기기ID(숫자)를 문자열 형식으로 리턴함
 * @param device node-hid 에서 받아온 기기 정보
 */
export const getValidDeviceName = (device: Device) => {
    return device.product ? device.product.trim() : "" + device.productId;
};
