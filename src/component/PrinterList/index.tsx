import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { getPrinters, printerType } from "util/printer";
import InnerList from "./InnerList";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 20,
        height: "calc(100vh - 168px)",
    },
    serchButton: {
        paddingBottom: 20,
    },
    notice: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: 20,
    },
    dn: {
        display: "none",
    },
}));

const PrinterList = () => {
    const classes = useStyles();
    const [printers, setPrinters] = useState<printerType[]>(() => getPrinters());
    const [selectedPrinter, setSelectedPrinter] = useState(() => localStorage.getItem("selectedPrinter") || "");

    useEffect(() => {
        // selectedPrinter가 printers에 없으면 localStorage에서 제거
        const found = printers.filter((printer) => printer.name === selectedPrinter);
        if (!found) {
            localStorage.removeItem("selectedPrinter");
        }
    }, [printers, selectedPrinter]);

    const handleSearchClick = useCallback(() => {
        setPrinters(getPrinters());
    }, []);

    const handleItemClick = useCallback(
        (idx: number) => () => {
            const selectedPrinterName = printers[idx].name;
            localStorage.setItem("selectedPrinter", selectedPrinterName);
            setSelectedPrinter(selectedPrinterName);
        },
        [printers]
    );

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
                    <InnerList printers={printers} selectedPrinter={selectedPrinter} onItemClick={handleItemClick} />
                </Box>
            </Box>
        </Paper>
    );
};

export default PrinterList;
