import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, withStyles, Theme, createStyles } from "@material-ui/core/styles";
import { PayloadAction } from "typesafe-actions";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import PrintIcon from "@material-ui/icons/Print";
import Delete from "@material-ui/icons/Delete";
import DatePicker from "component/DatePicker";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Modal from "component/Modal";
import MouseoverPopover, { ID as ColumnId, isPopOverCell, getPopOverMessageById } from "component/MouseoverPopover";
import clsx from "clsx";
import useOrder from "hook/useOrder";
import { Order, OrderForm } from "module/order";
import useCustomerForm from "hook/useCustomerForm";
import { CustomerForm } from "module/customer";
import { useHistory } from "react-router-dom";
import { getTimeMinusOpeningHour, timeToFormatString } from "util/time";

const electron = window.require("electron");
const { shell } = electron;

const useStyles = makeStyles(
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
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
        },
        clickable: {
            cursor: "pointer",
        },
        priceCell: {
            padding: "0 10px 0 0",
        },
        totalRevenue: {
            fontSize: "1.3rem",
            display: "flex",
            justifyContent: "flex-end",
            flexDirection: "column",
            paddingBottom: 15,
            marginLeft: 20,
        },
        modalMessage: {
            fontSize: "1.2rem",
            lineHeight: "1.8rem",
            marginBottom: "10px",
        },
        modalMessageEmphasize: {
            fontWeight: "bold",
        },
    })
);

const isClickableCell = (id: string) => {
    return id === "address" || id === "productName";
};

interface Column {
    id: ColumnId;
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "orderTime", label: "주문시각", width: 95, minWidth: 95, align: "center" },
    {
        id: "customerName",
        label: "고객명",
        minWidth: 30,
        align: "center",
    },
    {
        id: "phoneNumber",
        label: "전화번호",
        minWidth: 100,
        align: "center",
    },
    {
        id: "address",
        label: "배송지",
        minWidth: 100,
        align: "center",
    },
    {
        id: "productName",
        label: "상품명",
        minWidth: 100,
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
        width: 120,
        minWidth: 80,
        align: "center",
    },
    {
        id: "price",
        label: "가격",
        width: 90,
        align: "center",
        priceAlign: "right",
        format: (value) => value.toLocaleString(),
    },
    { id: "print", label: "출력", width: 38, minWidth: 38, align: "center" },
    {
        id: "remove",
        label: "삭제",
        width: 38,
        minWidth: 38,
        align: "center",
    },
];

const calculateTotalRevenue = (orders: Order[]) => {
    return orders
        .reduce(
            (totalRevenue, order) =>
                totalRevenue + order.products.reduce((acc, { price, amount }) => acc + price * amount, 0),
            0
        )
        .toLocaleString();
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

const getProductNames = (order: Order) => {
    const productNames = order.products.reduce(
        (acc, product) => `${acc}${product.name}${product.amount > 1 ? ` x ${product.amount}` : ``}, `,
        ""
    );
    return productNames.substring(0, productNames.length - 2);
};

const calculateOrderPrice = (order: Order) => {
    return order.products.reduce((acc, product) => acc + product.price * product.amount, 0).toLocaleString();
};

const getRequest = (order: Order) => {
    return `${order.customerRequest} / ${order.orderRequest}`;
};

interface ModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>> | ((param: boolean) => PayloadAction<string, boolean>);
    order: Order | undefined;
    handleOkClick: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
    message: string;
}
const StyledModal = ({ open, setOpen, order, handleOkClick, message }: ModalProps) => {
    const classes = useStyles();

    const handleCancelClick = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <Modal open={open} setOpen={setOpen}>
            <Box display="flex" flexDirection="column">
                <div className={classes.modalMessage}>
                    <div className={classes.modalMessageEmphasize}>
                        주문시각 : {order && timeToFormatString(order.orderTime)}
                    </div>
                    {order && order.customerName} <br />
                    {order && order.phoneNumber} <br />
                    {order && order.address} <br />
                    {order && getProductNames(order)} <br />
                    {order && calculateOrderPrice(order)} 원 <br /> <br />
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

export const OrderListPage = () => {
    const classes = useStyles();
    const [selectedDate, handleDateChange] = useState<Date | null>(() => {
        // 환경설정에서 시작 시각 설정한 만큼 빼줘야 함
        const correctedTime = getTimeMinusOpeningHour(Date.now());
        return new Date(correctedTime);
    });
    const { orders, getOrders, setOrderForm, removeOrder, setOrderEditMode } = useOrder();
    const { setCustomerOrderForm } = useCustomerForm();
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [clickedOrder, setClickedOrder] = useState<Order>();
    const history = useHistory();

    // anchor : 마우스 팝 오버할때 메세지가 위치할 element
    const [anchor, setAnchor] = useState<{ el: HTMLElement | null; message: string | undefined }>({
        el: null,
        message: undefined,
    });

    useEffect(() => {
        if (selectedDate) {
            const time = selectedDate.getTime();
            if (!isNaN(time)) {
                const year = selectedDate.getFullYear();
                const month = selectedDate.getMonth();
                const date = selectedDate.getDate();
                getOrders(year, month, date);
            }
        }
    }, [getOrders, selectedDate]);

    const handleAccept = useCallback((date) => {
        handleDateChange(date);
    }, []);

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

    const handlePrintButtonClick = useCallback((order) => () => {}, []);

    const handleRemoveButtonClick = useCallback(
        (order) => () => {
            setClickedOrder(order);
            setIsRemoveModalOpen(true);
        },
        []
    );

    const handleRemoveModalOkClick = useCallback(() => {
        if (clickedOrder) {
            removeOrder(clickedOrder.idx);
        }
        setIsRemoveModalOpen(false);
    }, [clickedOrder, removeOrder]);

    const cellContent = useCallback(
        (columnId: string, order: Order, index: number) => {
            switch (columnId) {
                case "idx":
                    return index + 1;
                case "orderTime":
                    return timeToFormatString(order.orderTime);
                case "customerName":
                    return order.customerName;
                case "phoneNumber":
                    return order.phoneNumber;
                case "address":
                    return order.address;
                case "productName":
                    return getProductNames(order);
                case "request":
                    return getRequest(order);
                case "paymentMethod":
                    return order.paymentMethod;
                case "price":
                    return calculateOrderPrice(order);
                case "print":
                    return (
                        <div className={classes.clickable} onClick={handlePrintButtonClick(order)}>
                            <PrintIcon />
                        </div>
                    );
                case "remove":
                    return (
                        <div className={classes.clickable} onClick={handleRemoveButtonClick(order)}>
                            <Delete />
                        </div>
                    );
            }
        },
        [handlePrintButtonClick, handleRemoveButtonClick, classes.clickable]
    );

    const handleCellClick = useCallback(
        (columnId: string, order: Order) => () => {
            switch (columnId) {
                case "address":
                    const searchParam = order.address.replace(" ", "%20");
                    shell.openExternal(`https://map.naver.com/v5/search/${searchParam}`);
                    break;
                case "productName":
                    const {
                        customerIdx,
                        customerName,
                        phoneNumber,
                        address,
                        customerRequest,
                        idx,
                        orderTime,
                        products,
                        orderRequest,
                        paymentMethod,
                    } = order;
                    const customerForm: CustomerForm = {
                        idx: customerIdx,
                        customerName,
                        phoneNumber,
                        address,
                        request: customerRequest,
                    };
                    const orderForm: OrderForm = {
                        idx,
                        orderTime,
                        products,
                        orderRequest,
                        paymentMethod,
                    };
                    setCustomerOrderForm(customerForm);
                    setOrderForm(orderForm);
                    setOrderEditMode(true);
                    history.push("/order-registry");
                    break;
                default:
                    break;
            }
        },
        [history, setCustomerOrderForm, setOrderForm, setOrderEditMode]
    );

    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <DatePicker
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    handleAccept={handleAccept}
                />
                <div className={classes.totalRevenue}>하루 매출 : {calculateTotalRevenue(orders)} 원</div>
            </Box>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className={clsx(classes.cell, classes.head)}
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order, index) => {
                            return (
                                <StyledTableRow hover role="checkbox" key={index}>
                                    {columns.map((column) => {
                                        return (
                                            <TableCell
                                                className={clsx(
                                                    classes.cell,
                                                    isClickableCell(column.id) && classes.clickable,
                                                    column.id === "price" && classes.priceCell
                                                )}
                                                key={column.id}
                                                align={column.id === "price" ? column.priceAlign : column.align}
                                                data-message={getPopOverMessageById(column.id)}
                                                onMouseEnter={isPopOverCell(column.id) ? handlePopoverOpen : () => {}}
                                                onMouseLeave={isPopOverCell(column.id) ? handlePopoverClose : () => {}}
                                                onClick={handleCellClick(column.id, order)}
                                            >
                                                {cellContent(column.id, order, index)}
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
            <StyledModal
                open={isRemoveModalOpen}
                setOpen={setIsRemoveModalOpen}
                order={clickedOrder}
                handleOkClick={handleRemoveModalOkClick}
                message="삭제 하시겠습니까?"
            />
        </Paper>
    );
};
