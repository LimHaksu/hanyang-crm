import React, { useState, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import { getPrinters, printerType } from "util/printer";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        height: "calc(100vh - 128px)",
    },
    list: {
        width: "100%",
        maxHeight: "calc(100vh - 237px)",
        overflowY: "auto",
        backgroundColor: theme.palette.background.paper,
    },
    serchButton: {
        padding: 20,
    },
    notice: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        margin: "0 0 0 20px",
    },
    dn: {
        display: "none",
    },
}));

export const PreferencesPrinterPage = () => {
    const classes = useStyles();
    const [printers, setPrinters] = useState<printerType[]>(getPrinters());
    const [selectedPrinter, setSelectedPrinter] = useState(localStorage.getItem("selectedPrinter") || "");

    const handleSearchClick = useCallback(() => {
        setPrinters(getPrinters());
    }, []);

    const handleCheckboxClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target = e.target as HTMLButtonElement;
        localStorage.setItem("selectedPrinter", target.value);
        setSelectedPrinter(target.value);
    }, []);

    return (
        <Paper className={classes.root}>
            <Box display="flex" flexDirection="column">
                <Box className={classes.serchButton}>
                    <Button onClick={handleSearchClick} variant="contained" color="primary">
                        프린터 목록 갱신
                    </Button>
                </Box>
                <Box className={clsx(classes.notice, printers.length === 0 && classes.dn)}>
                    전표를 인쇄할 프린터를 선택해주세요.
                </Box>
                <Box>
                    <List className={classes.list}>
                        {printers.map((printer, idx) => (
                            <ListItem key={idx}>
                                <ListItemIcon>
                                    <Checkbox
                                        value={printer.name}
                                        onClick={handleCheckboxClick}
                                        checked={printer.name === selectedPrinter}
                                    />
                                </ListItemIcon>
                                {printer.name}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Paper>
    );
};
