import React from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import PrinterList from "component/PrinterList";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100vh - 128px)",
    },
}));

export const PreferencesPrinterPage = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box display="flex" justifyContent="space-between">
                <Box>
                    <PrinterList />
                </Box>
                <Box></Box>
            </Box>
        </Paper>
    );
};
