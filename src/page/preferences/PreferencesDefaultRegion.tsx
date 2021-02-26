import { useState, useEffect, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

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
        text: {
            "& label": {
                fontSize: "1.4rem",
                fontWeight: "bold",
            },
        },
    })
);

export const PreferencesDefaultRegion = () => {
    const classes = useStyles();
    const [defaultRegion, setDefaultRegion] = useState(() => {
        const defaultRegion = localStorage.getItem("defaultRegion");
        return defaultRegion ? defaultRegion : "";
    });

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setDefaultRegion(value);
    }, []);

    useEffect(() => {
        localStorage.setItem("defaultRegion", defaultRegion);
    }, [defaultRegion]);

    return (
        <div className={classes.root}>
            <Box display="flex" justifyContent="center">
                <Box flexGrow={2} />
                <Box flexGrow={1}>
                    <Paper className={classes.paper}>
                        <div className={classes.title}>
                            주문 목록에서 지도를 검색할때 검색어 앞에 지역을 추가해줍니다.
                        </div>
                        <div className={classes.notice}>
                            예) 기본 지역을 <span className={classes.emphasis}>대전</span>으로 설정하고 주소가{" "}
                            <span className={classes.emphasis}>중구 선화동 367-11</span>인 주문 자료를 클릭하면{" "}
                            <span className={classes.emphasis}>대전 중구 선화동 367-11</span>을 지도에서 검색합니다.
                        </div>
                        <div>
                            <TextField
                                className={classes.text}
                                value={defaultRegion}
                                onChange={handleInputChange}
                                label="기본 지역"
                            />
                        </div>
                    </Paper>
                </Box>
                <Box flexGrow={2} />
            </Box>
        </div>
    );
};
