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
import usePrinter from "hook/usePrinter";
import { Order, OrderForm } from "module/order";
import useCustomerForm from "hook/useCustomerForm";
import { CustomerForm } from "module/customer";
import { useHistory } from "react-router-dom";
import { timeToFormatString } from "util/time";
import { print, serialPrint, isSerialPrinter } from "util/printer";

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
    { id: "orderTime", label: "주문시각", width: 110, minWidth: 110, align: "center" },
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
        .reduce((totalRevenue, order) => {
            let sum = 0;
            if (order.oldPrice) {
                sum += +order.oldPrice.replace(",", "");
            } else {
                sum += order.products.reduce((acc, { price, amount }) => acc + price * amount, 0);
            }
            return totalRevenue + sum;
        }, 0)
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
    // oldProductsNames : 자료 이관으로 넣은 과거 데이터, 문자열 형태에 구매 상품 정보가 담겨있음.
    if (order.oldProductsNames) {
        return order.oldProductsNames;
    }
    const productNames = order.products.reduce(
        (acc, product) => `${acc}${product.name}${product.amount > 1 ? ` x ${product.amount}` : ``}, `,
        ""
    );
    return productNames.substring(0, productNames.length - 2);
};

const calculateOrderPrice = (order: Order) => {
    // oldPrice : 자료 이관으로 넣은 과거 데이터, 상품 총 합계를 의미
    if (order.oldPrice) {
        return order.oldPrice;
    }
    return order.products.reduce((acc, product) => acc + product.price * product.amount, 0).toLocaleString();
};

const getRequest = (order: Order) => {
    return `${order.customerRequest ? order.customerRequest : ""} / ${order.orderRequest ? order.orderRequest : ""}`;
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
                    {order && (order.phoneNumber !== "-1" ? order.phoneNumber : "")} <br />
                    {order && (order.oldAddress ? order.oldAddress : order.address)} <br />
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
    const {
        orders,
        getOrders,
        setOrderForm,
        removeOrder,
        selectedDate,
        setSelectedDate,
        setOrderEditMode,
        isOrderAsc,
        setIsOrderAsc,
    } = useOrder();
    const { setCustomerOrderForm } = useCustomerForm();
    const { printerOption, papersContents, papersOptions, selectedPrinter, serialPrinterConfig } = usePrinter();
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [clickedOrder, setClickedOrder] = useState<Order>();
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const history = useHistory();
    const ordersForDisplay = isOrderAsc ? orders : [...orders].reverse();

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

    const handlePopoverOpen = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const target = event.currentTarget;
        const message = target.dataset.message;
        setAnchor({ el: target, message });
    }, []);

    const handlePopoverClose = useCallback(() => {
        setAnchor({ el: null, message: undefined });
    }, []);

    const handlePrintButtonClick = useCallback(
        (orderIndex: number, order: Order) => () => {
            papersOptions.forEach((paperOptions, paperIndex) => {
                const { printAvailable } = paperOptions;
                if (printAvailable) {
                    if (isSerialPrinter(selectedPrinter)) {
                        serialPrint(orderIndex, order, papersContents[paperIndex], serialPrinterConfig);
                    } else {
                        print(orderIndex, order, papersContents[paperIndex], printerOption);
                    }
                }
            });
        },
        [papersContents, papersOptions, printerOption, selectedPrinter, serialPrinterConfig]
    );

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
                    return order.phoneNumber === "-1" ? "" : order.phoneNumber;
                case "address":
                    return order.oldAddress ? order.oldAddress : order.address;
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
                        <div className={classes.clickable} onClick={handlePrintButtonClick(index, order)}>
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
                    const defaultRegion = localStorage.getItem("defaultRegion");
                    const searchParam = (defaultRegion ? `${defaultRegion} ` : "") + order.address.replace(" ", "%20");
                    shell.openExternal(`https://map.naver.com/v5/search/${searchParam}`);
                    break;
                case "productName":
                    if (order.oldProductsNames) {
                        setIsErrorModalOpen(true);
                        return;
                    }
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
                        phoneCallRecordIdx,
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
                        phoneCallRecordIdx,
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

    const handleErrorOkClick = useCallback(() => {
        setIsErrorModalOpen(false);
    }, []);

    const handleSortingClick = useCallback(() => {
        setIsOrderAsc(!isOrderAsc);
    }, [isOrderAsc, setIsOrderAsc]);

    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <DatePicker
                    selectedDate={selectedDate}
                    handleDateChange={handleDateChange}
                    handleAccept={handleAccept}
                />
                <div className={classes.totalRevenue}>하루 매출 : {calculateTotalRevenue(ordersForDisplay)} 원</div>
            </Box>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className={clsx(
                                        classes.cell,
                                        classes.head,
                                        column.id === "idx" && classes.clickable
                                    )}
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        width: column.width,
                                        minWidth: column.minWidth,
                                    }}
                                    onClick={column.id === "idx" ? handleSortingClick : () => {}}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ordersForDisplay.map((order, i) => {
                            const index = isOrderAsc ? i : ordersForDisplay.length - 1 - i;
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
            <Modal open={isErrorModalOpen} setOpen={setIsErrorModalOpen}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>자료 이관으로 등록한 옛날 주문정보는 수정할 수 없습니다.</div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="outlined" color="primary" onClick={handleErrorOkClick}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Paper>
    );
};
