import { useState, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { TimePicker } from "@material-ui/pickers";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: "calc(100vh - 128px)",
            backgroundColor: theme.palette.secondary.dark,
        },
        paper: {
            backgroundColor: "#fff",
            padding: 20,
            maxWidth: 500,
        },
        title: {
            fontWeight: "bold",
            marginBottom: 10,
        },
        notice: {
            fontSize: "1rem",
            lineHeight: "1.5rem",
            marginBottom: 10,
        },
        emphasis: {
            fontWeight: "bold",
        },
        time: {
            "& label": {
                fontSize: "1.4rem",
                color: "#000",
                fontWeight: "bold",
            },
        },
    })
);

export const PreferencesOpeningHours = () => {
    const classes = useStyles();
    const [selectedTime, handleTimeChange] = useState<Date | null>(() => {
        const savedTime = localStorage.getItem("openingHours");
        if (savedTime) {
            return JSON.parse(savedTime);
        }
        return new Date(2000, 0, 1, 0, 0);
    });

    useEffect(() => {
        localStorage.setItem("openingHours", JSON.stringify(selectedTime));
    }, [selectedTime]);

    return (
        <div className={classes.root}>
            <Box display="flex" justifyContent="center">
                <Box>
                    <Paper className={classes.paper}>
                        <div className={classes.title}>영업 시작 시각을 기준으로 날짜를 계산합니다.</div>
                        <div className={classes.notice}>
                            예) 영업 시작 시각을 <span className={classes.emphasis}>오후 3시 00분</span>으로 설정하고{" "}
                            <span className={classes.emphasis}>2월 10일</span> 자료를 검색하면{" "}
                            <span className={classes.emphasis}>2월 10일 오후 3시 ~ 2월 11일 오후 2시 59분</span>에
                            해당하는 자료가 나옵니다.{" "}
                        </div>
                        <div>
                            <TimePicker
                                className={classes.time}
                                value={selectedTime}
                                onChange={handleTimeChange}
                                label="영업 시작 시각"
                                format="a hh시 mm분"
                                okLabel="확인"
                                cancelLabel="취소"
                            />
                        </div>
                    </Paper>
                </Box>
            </Box>
        </div>
    );
};
