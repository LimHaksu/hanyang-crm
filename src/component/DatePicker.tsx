import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";

interface Props {
    selectedDate: Date | null;
    handleDateChange: (value: React.SetStateAction<Date | null>) => void;
    handleAccept: ((date: Date | null) => void) | undefined;
}

const useStyles = makeStyles({
    datePicker: {
        margin: "5px 0 5px 40px",
        "& input": {
            fontSize: "1.4rem",
        },
    },
});

const DatePicker = ({ selectedDate, handleDateChange, handleAccept }: Props) => {
    const classes = useStyles();

    return (
        <KeyboardDatePicker
            className={classes.datePicker}
            autoOk
            showTodayButton
            todayLabel="오늘"
            label="날짜"
            disableFuture
            format="yyyy년 MM월 dd일"
            value={selectedDate}
            onChange={handleDateChange}
            okLabel="확인"
            cancelLabel="취소"
            invalidDateMessage="올바른 날짜를 입력해주세요."
            maxDateMessage="오늘 이후는 조회할 수 없습니다."
            minDateMessage="1900년 이전은 조회할 수 없습니다."
            onAccept={handleAccept}
        />
    );
};

export default React.memo(DatePicker);
