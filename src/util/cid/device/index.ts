import pccallVer1 from "./PCCALL_VER-1.0";

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
