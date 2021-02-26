import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { getPrinters, Printer } from "util/printer";
import InnerList from "./InnerList";
import clsx from "clsx";
import usePrinter from "hook/usePrinter";

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
    const [printers, setPrinters] = useState<Printer[]>([]);
    const { selectedPrinter, setSelectedPrinter, setSerialPrinterConfig, serialPrinterConfig } = usePrinter();

    useEffect(() => {
        getPrinters().then((printers) => {
            setPrinters(printers);
        });
    }, []);

    useEffect(() => {
        // selectedPrinter가 printers에 없으면 localStorage에서 제거
        if (selectedPrinter && printers.length > 0) {
            const found = printers.find((printer) => printer.name === selectedPrinter);
            if (!found) {
                setSelectedPrinter("");
            }
        }
    }, [printers, selectedPrinter, setSelectedPrinter]);

    const handleSearchClick = useCallback(async () => {
        const printers = await getPrinters();
        setPrinters(printers);
    }, []);

    const handleItemClick = useCallback(
        (idx: number) => () => {
            const selectedPrinterName = printers[idx].name;
            setSelectedPrinter(selectedPrinterName);
        },
        [printers, setSelectedPrinter]
    );

    return (
        <Paper className={classes.root}>
            <Box display="flex" flexDirection="column">
                <Box className={classes.serchButton}>
                    <Button onClick={handleSearchClick} variant="contained" color="primary">
                        컴퓨터에 연결된 프린터 목록 갱신
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
