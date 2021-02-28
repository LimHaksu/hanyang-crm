import React, { useCallback, useEffect, useState } from "react";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { PayloadAction } from "typesafe-actions";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";
import DoneIcon from "@material-ui/icons/Done";
import Delete from "@material-ui/icons/Delete";
import DatePicker from "component/DatePicker";
import Modal from "component/Modal";
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
    modalMessage: {
        fontSize: "1.2rem",
        lineHeight: "1.8rem",
        marginBottom: "10px",
    },
    modalMessageEmphasize: {
        fontWeight: "bold",
    },
});

interface Column {
    id: "idx" | "receivedDatetime" | "customerName" | "phoneNumber" | "address" | "orderIdx" | "remove";
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
    {
        id: "remove",
        label: "삭제",
        width: 38,
        minWidth: 38,
        align: "center",
    },
];

interface ModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>> | ((param: boolean) => PayloadAction<string, boolean>);
    phoneCallRecord: PhoneCallRecord | undefined;
    handleOkClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
    message: string;
}
const StyledModal = ({ open, setOpen, phoneCallRecord, handleOkClick, message }: ModalProps) => {
    const classes = useStyles();

    const handleCancelClick = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <Modal open={open} setOpen={setOpen}>
            <Box display="flex" flexDirection="column">
                <div className={classes.modalMessage}>
                    <div className={classes.modalMessageEmphasize}>
                        수신시각 : {phoneCallRecord && timeToFormatString(phoneCallRecord.receivedDatetime)}
                    </div>
                    {phoneCallRecord && phoneCallRecord.customerName} <br />
                    {phoneCallRecord && phoneCallRecord.phoneNumber} <br />
                    {phoneCallRecord && phoneCallRecord.address} <br />
                    <div className={classes.modalMessageEmphasize}>{message}</div>
                </div>
                <Box display="flex" justifyContent="space-around">
                    <Button variant="outlined" color="primary" onClick={handleOkClick}>
                        예
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleCancelClick}>
                        아니오
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "&:nth-of-type(even)": {
                backgroundColor: "#f3f3f3",
            },
        },
    })
)(TableRow);

interface PhoneCallRecordTableBodyProp {
    handleRemoveButtonClick: (order: any) => () => void;
}

const PhoneCallRecordTableBody = ({ handleRemoveButtonClick }: PhoneCallRecordTableBodyProp) => {
    const history = useHistory();
    const classes = useStyles();
    const { setCustomerOrderForm } = useCustomerForm();
    const { setOrderForm, setOrderEditMode } = useOrder();
    const { phoneCallRecords, isPhoneCallRecordAsc } = usePhone();

    const phoneCallRecordsForDisplay = isPhoneCallRecordAsc ? phoneCallRecords : [...phoneCallRecords].reverse();

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
            {phoneCallRecordsForDisplay.map((row, i) => {
                const index = isPhoneCallRecordAsc ? i : phoneCallRecordsForDisplay.length - 1 - i;
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

                            if (column.id === "remove") {
                                return (
                                    <TableCell className={classes.cell} key={column.id} align={column.align}>
                                        <div className={classes.clickableCell} onClick={handleRemoveButtonClick(row)}>
                                            <Delete />
                                        </div>
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
    const {
        selectedDate,
        setSelectedDate,
        getPhoneCallRecords,
        removePhoneCallRecord,
        setIsPhoneCallRecordAsc,
        isPhoneCallRecordAsc,
    } = usePhone();
    const [clickedRecord, setClickedRecord] = useState<PhoneCallRecord>();
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    useEffect(() => {
        // 두 번 렌더링 되는 원인
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

    const handleRemoveButtonClick = useCallback(
        (phoneCallRecord) => () => {
            setClickedRecord(phoneCallRecord);
            setIsRemoveModalOpen(true);
        },
        []
    );

    const handleRemoveModalOkClick = useCallback(() => {
        if (clickedRecord) {
            removePhoneCallRecord(clickedRecord.idx);
        }
        setIsRemoveModalOpen(false);
    }, [clickedRecord, removePhoneCallRecord]);

    const handleSortingClick = useCallback(() => {
        setIsPhoneCallRecordAsc(!isPhoneCallRecordAsc);
    }, [isPhoneCallRecordAsc, setIsPhoneCallRecordAsc]);

    return (
        <Paper className={classes.root}>
            <DatePicker selectedDate={selectedDate} handleDateChange={handleDateChange} handleAccept={handleAccept} />
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className={clsx(
                                        classes.cell,
                                        classes.head,
                                        column.id === "idx" && classes.clickableCell
                                    )}
                                    key={column.id}
                                    align={column.align}
                                    style={{ width: column.width, minWidth: column.minWidth }}
                                    onClick={column.id === "idx" ? handleSortingClick : () => {}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <PhoneCallRecordTableBody handleRemoveButtonClick={handleRemoveButtonClick} />
                </Table>
            </TableContainer>
            <StyledModal
                open={isRemoveModalOpen}
                setOpen={setIsRemoveModalOpen}
                phoneCallRecord={clickedRecord}
                handleOkClick={handleRemoveModalOkClick}
                message="삭제 하시겠습니까?"
            />
        </Paper>
    );
}
