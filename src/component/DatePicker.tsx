import React, { useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

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
    todayButton: {
        height: 40,
        margin: "auto 0 5px 5px",
    },
});

const DatePicker = ({ selectedDate, handleDateChange, handleAccept }: Props) => {
    const classes = useStyles();

    const handleTodayButtonClick = useCallback(() => {
        handleDateChange(new Date());
    }, [handleDateChange]);

    return (
        <Box display="flex">
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
            <Button
                className={classes.todayButton}
                variant="contained"
                color="primary"
                onClick={handleTodayButtonClick}
            >
                오늘
            </Button>
        </Box>
    );
};

export default React.memo(DatePicker);
