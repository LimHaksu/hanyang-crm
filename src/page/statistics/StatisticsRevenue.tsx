import { useState, useCallback } from "react";
import { HorizontalBarChart, BarChartData } from "component/graph";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { getYearlyRevenues, getMonthlyRevenues } from "db/order";
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
    const [data, setData] = useState<BarChartData>({ list: [], unit: "원", y: "매출" });
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

    const handleDivisionChange = useCallback(async (event: React.ChangeEvent<{ value: unknown }>) => {
        const division = event.target.value as string;
        if (division === "year") {
            const revenues = await getYearlyRevenues();
            const list = revenues.map((r) => ({ name: `${r.year}년`, value: r.revenue }));
            setData({ list, format: "s", y: "매출", unit: "원" });
        }
        setDivision(division);
    }, []);

    const handleYearChange = useCallback(async (event: React.ChangeEvent<{ value: unknown }>) => {
        const year = event.target.value as number;
        const revenues = await getMonthlyRevenues(year);
        const list = revenues.map((r) => ({ name: `${r.month}월`, value: r.revenue }));
        setSelectedYear("" + year);
        setData({ list, format: "s", y: "매출", unit: "원" });
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
                                <MenuItem value="year" key="year">
                                    연 매출
                                </MenuItem>
                                <MenuItem value="month" key="month">
                                    월 매출
                                </MenuItem>
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
                                    {years.map((year, index) => (
                                        <MenuItem value={year} key={index}>
                                            {year}
                                        </MenuItem>
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
