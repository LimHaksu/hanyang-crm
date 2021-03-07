import { useState, useCallback } from "react";
import { HorizontalBarChart, BarChartData } from "component/graph";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { getFirstOrderDatetime } from "db/order";
import useOrder from "hook/useOrder";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100vh - 128px)",
        backgroundColor: theme.palette.secondary.dark,
    },
    container: {
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    },
    formControl: {
        margin: theme.spacing(1),
        width: 120,
    },
}));

export const StatisticsRevenue = () => {
    const classes = useStyles();
    const [data, setData] = useState<BarChartData>(() => ({
        list: [
            { name: "1월", value: 30000000 },
            { name: "2월", value: 25753588 },
            { name: "3월", value: 40135488 },
            { name: "4월", value: 35426582 },
            { name: "5월", value: 26845756 },
            { name: "6월", value: 35687485 },
            { name: "7월", value: 41235754 },
            { name: "8월", value: 35486755 },
            { name: "9월", value: 23542685 },
            { name: "10월", value: 35486581 },
            { name: "11월", value: 46526852 },
            { name: "12월", value: 41358562 },
        ],
        format: "s",
        y: "매출",
        unit: "원",
    }));
    const { firstOrderDate } = useOrder();
    const [division, setDivision] = useState("");
    const [years] = useState(() => {
        const years = [];
        const today = new Date();
        const lastYear = today.getFullYear();
        for (let year = firstOrderDate.year; year <= lastYear; ++year) {
            years.push(year);
        }
        return years;
    });
    const [selectedYear, setSelectedYear] = useState("");

    const handleDivisionChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        setDivision(event.target.value as string);
    }, []);

    const handleYearChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedYear(event.target.value as string);
    }, []);

    return (
        <Paper className={classes.root}>
            <Box display="flex" justifyContent="center">
                <Paper className={classes.container}>
                    <Box display="flex">
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel htmlFor="revenue-select-label">구분</InputLabel>
                            <Select
                                labelId="revenue-select-label"
                                id="revenue-select"
                                value={division}
                                onChange={handleDivisionChange}
                                label="구분"
                            >
                                <MenuItem value="year">연 매출</MenuItem>
                                <MenuItem value="month">월 매출</MenuItem>
                            </Select>
                        </FormControl>
                        {division === "month" && (
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel htmlFor="revenue-select-label">년도</InputLabel>
                                <Select
                                    labelId="revenue-select-label"
                                    id="revenue-select"
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    label="년도"
                                >
                                    {years.map((year) => (
                                        <MenuItem value={year}>{year}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                    <HorizontalBarChart data={data} />
                </Paper>
            </Box>
        </Paper>
    );
};
