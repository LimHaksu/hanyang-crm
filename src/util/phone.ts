/**
 * 숫자로만 이루어진 전화번호 사이에 - 를 입력해줍니다.
 * ex:
 * 01012345678 => 010-1234-5678
 * 0212345678 => 02-1234-5678
 * 0421234567 => 042-123-4567
 * 050412345678 => 0504-1234-5678
 * 16771234 => 1677-1234
 * @param phoneNumber
 */
export function insertDashIntoPhoneNumber(phoneNumber: string) {
    return phoneNumber
        .replace(/-/g, "")
        .replace(/(^02|^050[0-9]{1}|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
        .replace("--", "-");
}
