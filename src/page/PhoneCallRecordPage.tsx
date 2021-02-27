import React, { useCallback, useEffect } from "react";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import DatePicker from "component/DatePicker";
import clsx from "clsx";
import { PhoneCallRecord } from "module/phone";
import { useHistory } from "react-router-dom";
import usePhone from "hook/usePhone";
import useCustomerForm from "hook/useCustomerForm";
import useOrder from "hook/useOrder";
import { timeToFormatString, timeToYearMonthDate } from "util/time";

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "calc(100vh - 64px)",
    },
    datePicker: {
        margin: "5px 0 5px 20px",
    },
    container: {
        maxHeight: "calc(100vh - 130px)",
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
        userSelect: "none",
        textAlign: "center",
    },
    clickableCell: {
        cursor: "pointer",
    },
    button: {
        display: "flex",
        justifyContent: "center",
    },
    emphasis: {
        fontWeight: "bold",
    },
});

interface Column {
    id: "idx" | "receivedDatetime" | "customerName" | "phoneNumber" | "address" | "orderIdx";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "receivedDatetime", label: "수신시각", width: 105, minWidth: 105, align: "center" },
    {
        id: "customerName",
        label: "고객명",
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
        id: "orderIdx",
        label: "주문작성",
        minWidth: 100,
        width: 100,
        align: "center",
    },
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

const PhoneCallRecordTableBody = () => {
    const history = useHistory();
    const classes = useStyles();
    const { setCustomerOrderForm } = useCustomerForm();
    const { setOrderForm, setOrderEditMode } = useOrder();
    const { phoneCallRecords } = usePhone();

    const handleCreateButtonClick = useCallback(
        ({
            idx,
            customerName,
            phoneNumber,
            address,
            request,
        }: Pick<PhoneCallRecord, "idx" | "customerName" | "phoneNumber" | "address" | "request">) => () => {
            setCustomerOrderForm({
                idx: -1,
                customerName,
                phoneNumber,
                address,
                request,
            });
            setOrderForm({
                idx: -1,
                orderRequest: "",
                orderTime: Date.now(),
                paymentMethod: "현금",
                products: [],
                phoneCallRecordIdx: idx,
            });
            setOrderEditMode(false);
            history.push("/order-registry");
        },
        [history, setCustomerOrderForm, setOrderEditMode, setOrderForm]
    );

    return (
        <TableBody>
            {[...phoneCallRecords].reverse().map((row, i) => {
                const index = phoneCallRecords.length - 1 - i;
                const { idx, customerName, phoneNumber, address, request } = row;
                return (
                    <StyledTableRow hover role="checkbox" key={row.idx}>
                        {columns.map((column) => {
                            if (column.id === "idx") {
                                return (
                                    <TableCell className={classes.cell} key={column.id} align={column.align}>
                                        {index + 1}
                                    </TableCell>
                                );
                            }
                            if (column.id === "orderIdx") {
                                return (
                                    <TableCell
                                        className={clsx(classes.cell, !row.orderIdx && classes.clickableCell)}
                                        key={column.id}
                                        align={column.align}
                                    >
                                        {row.orderIdx ? (
                                            <div className={clsx(classes.button, classes.emphasis)}>
                                                <DoneIcon /> 완료
                                            </div>
                                        ) : (
                                            <div
                                                className={classes.button}
                                                onClick={handleCreateButtonClick({
                                                    idx,
                                                    customerName,
                                                    phoneNumber,
                                                    address,
                                                    request,
                                                })}
                                            >
                                                <CreateIcon /> 작성
                                            </div>
                                        )}
                                    </TableCell>
                                );
                            }
                            const value = row[column.id];
                            return (
                                <TableCell className={classes.cell} key={column.id} align={column.align}>
                                    {column.id === "receivedDatetime" && typeof value === "number"
                                        ? timeToFormatString(value)
                                        : value}
                                </TableCell>
                            );
                        })}
                    </StyledTableRow>
                );
            })}
        </TableBody>
    );
};

export function PhoneCallRecordPage() {
    const classes = useStyles();
    const { selectedDate, setSelectedDate, getPhoneCallRecords } = usePhone();

    useEffect(() => {
        if (selectedDate) {
            getPhoneCallRecords(timeToYearMonthDate(selectedDate));
        }
    }, [getPhoneCallRecords, selectedDate]);

    const handleDateChange = useCallback(
        (date) => {
            setSelectedDate(date);
        },
        [setSelectedDate]
    );

    const handleAccept = useCallback(
        (date) => {
            handleDateChange(date);
        },
        [handleDateChange]
    );

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
                    <PhoneCallRecordTableBody />
                </Table>
            </TableContainer>
        </Paper>
    );
}
