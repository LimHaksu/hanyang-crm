import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import DragPrintContentList from "./DragPrintContentList";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 30,
        maxHeight: "calc(100vh - 128px)",
        width: 400,
        boxSizing: "border-box",
        overflow: "auto",
    },
    title: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        margin: "10px 0 10px 0",
    },
}));

const Preview = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <div className={classes.title}>위치 수정, 삭제</div>
            <DragPrintContentList />
        </Paper>
    );
};

export default Preview;
