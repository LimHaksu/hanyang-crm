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
import MouseoverPopover, { isPopOverCell, getPopOverMessageById } from "component/popover/MouseoverPopover";

interface Column {
    id:
        | "idx"
        | "orderTime"
        | "customerName"
        | "phoneNumber"
        | "address"
        | "productName"
        | "request"
        | "paymentMethod"
        | "price"
        | "map";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
    format?: (value: number) => string;
}

interface Data {
    idx: number;
    orderTime: string;
    customerName: string;
    phoneNumber: string;
    map: string;
    address: string;
    productName: string;
    request: string;
    paymentMethod: "현금" | "카드" | "선결제";
    price: number;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "orderTime", label: "주문시각", width: 95, minWidth: 95, align: "center" },
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
        id: "productName",
        label: "상품명",
        minWidth: 300,
        align: "center",
    },
    {
        id: "request",
        label: "요청사항",
        minWidth: 100,
        align: "center",
    },
    {
        id: "paymentMethod",
        label: "결제방법",
        width: 80,
        minWidth: 80,
        align: "center",
    },
    {
        id: "price",
        label: "가격",
        width: 100,
        align: "center",
        priceAlign: "right",
        format: (value) => value.toLocaleString(),
    },
];

const createData = (
    idx: number,
    orderTime: string,
    customerName: string,
    phoneNumber: string,
    map: string,
    address: string,
    productName: string,
    request: string,
    paymentMethod: "현금" | "카드" | "선결제",
    price: number
): Data => {
    return { idx, orderTime, customerName, phoneNumber, map, address, productName, request, paymentMethod, price };
};

const rows = [
    createData(
        1,
        "오전 11:12",
        "손님",
        "010-1234-5678",
        "지도",
        "중구 선화동 123-456번지 선화아파트 101동 1001호",
        "상품명상품명상품명상일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십",
        "요청사항",
        "현금",
        20000
    ),
    createData(
        2,
        "오전 11:12",
        "손님",
        "010-1234-5678",
        "지도",
        "중구 선화동 123-456번지 선화아파트 101동 1001호",
        "상품명상품명상품명상일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십일이삼사오육칠팔구십",
        "요청사항",
        "현금",
        20000
    ),
];

const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "&:nth-of-type(odd)": {
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
    },
    priceCell: {
        padding: "0 10px 0 0",
    },
});

export const OrderListPage = () => {
    const classes = useStyles();
    const [selectedDate, handleDateChange] = useState<Date | null>(new Date());
    const handleAccept = useCallback((date) => {
        handleDateChange(date);
    }, []);

    const [anchor, setAnchor] = React.useState<{ el: HTMLElement | null; message: string | undefined }>({
        el: null,
        message: undefined,
    });

    const handlePopoverOpen = useCallback(
        (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
            const target = event.currentTarget;
            const message = target.dataset.message;
            setAnchor({ el: target, message });
        },
        [setAnchor]
    );

    const handlePopoverClose = useCallback(() => {
        setAnchor({ el: null, message: undefined });
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
                                    className={`${classes.cell} ${classes.head}`}
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
                                            <TableCell
                                                className={`${classes.cell} ${
                                                    column.id === "price" && classes.priceCell
                                                }`}
                                                key={column.id}
                                                align={column.id === "price" ? column.priceAlign : column.align}
                                                data-message={getPopOverMessageById(column.id)}
                                                onMouseEnter={isPopOverCell(column.id) ? handlePopoverOpen : () => {}}
                                                onMouseLeave={isPopOverCell(column.id) ? handlePopoverClose : () => {}}
                                            >
                                                {column.format && typeof value === "number"
                                                    ? column.format(value)
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
            <MouseoverPopover anchor={anchor} handlePopoverClose={handlePopoverClose} />
        </Paper>
    );
};
