/**
 * milliseconds 시간을 받아오면 영업 시작 시각에 해당하는 milliseconds를 더해서 반환
 * 영업 시작 시각을 설정하지 않았으면 인풋을 그대로 반환
 * @param time 1970-01-01 기준의 milliseconds
 */
export const getTimeWithOpeningHour = (time: number) => {
    const savedTime = localStorage.getItem("openingHour");
    if (savedTime) {
        const savedTimeDate = JSON.parse(savedTime) as Date;
        const hour = savedTimeDate.getHours();
        const minute = savedTimeDate.getMinutes();
        return time + (hour * 60 + minute) * 60 * 1000;
    }
    return time;
};
