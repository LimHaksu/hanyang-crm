import { timeToFormatString } from "util/time";
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
export const insertDashIntoPhoneNumber = (phoneNumber: string) => {
    return phoneNumber
        .replace(/-/g, "")
        .replace(/(^02|^050[0-9]{1}|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
        .replace("--", "-");
};

/**
 * 이 함수를 호출하면 전화 알람 팝업창이 뜹니다.
 * @param receivedDatetime 1970-01-01 기준 millisecond
 * @param phoneNumber -(dash) 포함 전화 문자열
 * @param customerName (DB에 저장돼있는 경우) 고객명 - optional
 * @param address (DB에 저장돼있는 경우) 주소 - optional
 * @param customerRequest (DB에 저장돼있는경우) 단골 요청사항 - optional
 */
export const createPhonCallPopup = ({
    receivedDatetime,
    phoneNumber,
    customerName,
    address,
    customerRequest,
}: {
    receivedDatetime: number;
    phoneNumber: string;
    customerName?: string;
    address?: string;
    customerRequest?: string;
}) => {
    const popup = window.open("", "PopupPhoneCall", `width=${window.screen.width},height=${window.screen.height}`);
    const handleClick = () => {
        if (popup) {
            popup.close();
        }
    };
    if (popup) {
        const formatTime = timeToFormatString(receivedDatetime);
        const prevDiv = popup.document.body.querySelector("div");
        if (prevDiv) {
            prevDiv.remove();
        }
        const el = document.createElement("div");
        el.innerHTML = `
        <div style="height:100%;
                width:100%;
                display:flex; 
                flex-direction:column; 
                justify-content:center; 
                text-align:center; 
                font-size:6rem;
                background-color:#298d63;
                color:#ffffff;">
            <div style="font-size:3rem; margin-bottom:10px">${formatTime}</div>
            <div style="font-size:8rem; margin-bottom:10px">${phoneNumber}</div>
            <div style="margin-bottom:10px">${customerName ? customerName : "신규 고객"}</div>
            ${address ? `<div style="font-size:4rem; margin-bottom:25px">${address}</div>` : ""}
            ${customerRequest ? `<div style="font-size:3rem;">단골 요청사항: ${customerRequest}</div>` : ""}
        </div>`;
        popup.document.body.appendChild(el);
        popup.document.body.onclick = handleClick;
    }
};
