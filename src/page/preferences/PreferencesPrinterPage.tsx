import React from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import PrinterList from "component/PrinterList";
import PrintPageSetting from "component/PrintPageSetting";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100vh - 128px)",
        backgroundColor: theme.palette.secondary.dark,
    },
    printerList: {
        marginRight: 15,
    },
}));

export const PreferencesPrinterPage = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box display="flex" justifyContent="center">
                <div className={classes.printerList}>
                    <PrinterList />
                </div>
                <PrintPageSetting />
            </Box>
        </Paper>
    );
};
