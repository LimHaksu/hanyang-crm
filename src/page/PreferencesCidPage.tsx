import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import CidList from "component/CidList";
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100vh - 128px)",
    },
}));

export const PreferencesCidPage = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <CidList />
        </Paper>
    );
};
