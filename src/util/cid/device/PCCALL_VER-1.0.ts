import { insertDashIntoPhoneNumber } from "util/phone";

const getPhoneNumberFromData = (data: Uint8Array) => {
    // CID : PC-CALL Ver-1.0
    // 인풋 : Uint8Array(28)
    // 예제
    // 010-1234-5678
    // 02-1234-5678
    // 042-123-4567
    // 1661-1234

    // data[0] : 3 일 때만 정상 수신 데이터
    // data[1] : 48 버림
    // data[2] : 54 버림
    // data[3] : 63 버림
    // data[4] : 56 버림
    // data[5] : 숫자 버림
    // data[6] : 숫자 버림
    // data[7] : 45 버림
    // data[8] : 3 버림
    // data[9] : 0  0   0   1
    // data[10] : 1 2   4   6
    // data[11] : 0 1   2   6
    // data[12] : 1 2   1   1
    // data[13] : 2 3   2   1
    // data[14] : 3 4   3   2
    // data[15] : 4 5   4   3
    // data[16] : 3 버림
    // data[17] : 5 6   5   4
    // data[18] : 6 7   6   255
    // data[19] : 7 8   7   0
    // data[20] : 8 255 255 2
    // data[21] : 255 버림  255
    // data[22] : 54 버림
    // data[23] : 57 버림
    // data[24] : 3 버림
    // data[25] : 193 버림
    // data[26] : 163 버림
    // data[27] : 199 버림

    // 규칙
    // 8, 8, 8, 4 로 끊어서 읽음 총합 28
    // data[0] === 3일때만 정상 수신
    if (data[0] === 3) {
        let phoneNumber = "";
        for (let i = 9; i < 28; ++i) {
            if (data[i] === 255) {
                break;
            }
            if (data[i] >= "0".charCodeAt(0) && data[i] <= "9".charCodeAt(0)) {
                phoneNumber += String.fromCharCode(data[i]);
            }
        }
        return insertDashIntoPhoneNumber(phoneNumber);
    }
};

export default getPhoneNumberFromData;
