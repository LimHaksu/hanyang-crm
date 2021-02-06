import React, { useState, useCallback } from "react";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import DatePicker from "component/datePicker/DatePicker";
import clsx from "clsx";

interface Column {
    id: "idx" | "orderTime" | "cidMachineIdx" | "customerName" | "phoneNumber" | "address" | "registerProduct";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
    getRegistryTextWithEmoji?: (value: string) => string;
}

interface Data {
    idx: number;
    orderTime: string;
    cidMachineIdx: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    registerProduct: string;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "orderTime", label: "수신시각", width: 95, minWidth: 95, align: "center" },
    { id: "cidMachineIdx", label: "수신기기", width: 95, minWidth: 95, align: "center" },
    {
        id: "customerName",
        label: "주문자명",
        minWidth: 95,
        align: "center",
    },
    {
        id: "phoneNumber",
        label: "전화번호",
        minWidth: 170,
        align: "center",
    },
    {
        id: "address",
        label: "배송지",
        minWidth: 300,
        align: "center",
    },
    {
        id: "registerProduct",
        label: "주문작성",
        minWidth: 100,
        width: 100,
        align: "center",
        getRegistryTextWithEmoji: (value) => (value === "완료" ? `✔️${value}` : `📝${value}`),
    },
];

function createData(
    idx: number,
    orderTime: string,
    cidMachineIdx: number,
    customerName: string,
    phoneNumber: string,
    address: string,
    registerProduct: "작성" | "완료"
): Data {
    return { idx, orderTime, cidMachineIdx, customerName, phoneNumber, address, registerProduct };
}

const rows = [
    createData(1, "오전 11:12", 1, "손님", "010-1234-5678", "중구 선화동 123-456번지 선화아파트 101동 1001호", "완료"),
    createData(2, "오전 11:12", 2, "손님", "010-1234-5678", "중구 선화동 123-456번지 선화아파트 101동 1001호", "작성"),
];

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "&:nth-of-type(even)": {
                backgroundColor: "#f3f3f3",
            },
        },
    })
)(TableRow);

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "calc(100vh - 64px)",
    },
    datePicker: {
        margin: "5px 0 5px 20px",
    },
    container: {
        maxHeight: "calc(100vh - 122px)",
    },
    head: {
        fontWeight: "bold",
    },
    cell: {
        fontSize: "1.1rem",
        borderWidth: 0,
        borderRightWidth: 1,
        borderColor: "#bebebe",
        borderStyle: "solid",
        padding: "15px 0",
        cursor: "pointer",
        userSelect: "none",
    },
});

export function PhoneCallRecordPage() {
    const classes = useStyles();
    const [selectedDate, handleDateChange] = useState<Date | null>(new Date());

    const handleAccept = useCallback((date) => {
        handleDateChange(date);
    }, []);

    return (
        <Paper className={classes.root}>
            <DatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} handleAccept={handleAccept} />
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className={clsx(classes.cell, classes.head)}
                                    key={column.id}
                                    align={column.align}
                                    style={{ width: column.width, minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <StyledTableRow hover role="checkbox" key={row.idx}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell className={classes.cell} key={column.id} align={column.align}>
                                                {column.getRegistryTextWithEmoji && typeof value === "string"
                                                    ? column.getRegistryTextWithEmoji(value)
                                                    : value}
                                            </TableCell>
                                        );
                                    })}
                                </StyledTableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
