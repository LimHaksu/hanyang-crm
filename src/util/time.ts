/**
 * milliseconds 시간을 받아오면 영업 시작 시각에 해당하는 milliseconds를 빼서 반환.
 * 자료를 조회할때 사용.
 * 영업 시작 시각을 설정하지 않았으면 인풋을 그대로 반환.
 * @param time 1970-01-01 기준의 milliseconds
 */
export const getTimePlusOpeningHour = (time: number) => {
    const savedTime = localStorage.getItem("openingHours");
    if (savedTime) {
        const savedTimeDate = new Date(JSON.parse(savedTime));
        const hour = savedTimeDate.getHours();
        const minute = savedTimeDate.getMinutes();
        return time + (hour * 60 + minute) * 60 * 1000;
    }
    return time;
};

/**
 * milliseconds 시간을 받아오면 영업 시작 시각에 해당하는 milliseconds를 더해서 반환.
 * 오늘 날짜를 세팅할 때 사용 new Date(getTimeMinusOpeningHour(Date.now())).
 * 영업 시작 시각을 설정하지 않았으면 인풋을 그대로 반환.
 * @param time 1970-01-01 기준의 milliseconds
 */
export const getTimeMinusOpeningHour = (time: number) => {
    const savedTime = localStorage.getItem("openingHours");
    if (savedTime) {
        const savedTimeDate = new Date(JSON.parse(savedTime));
        const hour = savedTimeDate.getHours();
        const minute = savedTimeDate.getMinutes();
        return time - (hour * 60 + minute) * 60 * 1000;
    }
    return time;
};

/**
 * milliseconds를 입력 받으면 '오전/오후 h:mm' 포맷의 시간으로 리턴
 * @param orderTime 1970-01-01 기준의 milliseconds
 */
export const timeToFormatString = (orderTime: number) => {
    const date = new Date(orderTime);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const isMorning = hours < 12;
    let prevStr = "";
    if (isMorning) {
        prevStr = "오전 ";
    } else {
        prevStr = "오후 ";
        hours -= 12;
        if (hours === 0) {
            hours = 12;
        }
    }
    return `${prevStr} ${hours < 10 ? "0" + hours : hours} : ${minutes < 10 ? "0" + minutes : minutes}`;
};

/**
 * milliseconds를 입력 받으면 '년월일 오전/오후 h:mm' 포맷의 시간으로 리턴
 * @param orderTime 1970-01-01 기준의 milliseconds
 */
export const timeToFullFormatString = (orderTime: number) => {
    const date = new Date(orderTime);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const isMorning = hours < 12;
    let prevStr = "";
    if (isMorning) {
        prevStr = "오전 ";
    } else {
        prevStr = "오후 ";
        hours -= 12;
        if (hours === 0) {
            hours = 12;
        }
    }
    return `${y}년 ${m}월 ${d}일, ${prevStr} ${hours < 10 ? "0" + hours : hours} : ${
        minutes < 10 ? "0" + minutes : minutes
    }`;
};

/**
 * Date를 입력하면 {year, month, date} 객체 리턴
 */
export const timeToYearMonthDate = (date: Date) => {
    return { year: date.getFullYear(), month: date.getMonth(), date: date.getDate() };
};
