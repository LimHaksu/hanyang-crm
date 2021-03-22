import { memo, useState, useCallback, useEffect } from "react";
import { makeStyles, createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import useCustomerForm from "hook/useCustomerForm";
import Grid from "@material-ui/core/Grid";
import { timeToFullFormatString } from "util/time";
import clsx from "clsx";
import { OrderByCustomer } from "module/customer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            backgroundColor: "#fff",
            maxHeight: "199px",
        },
        head: {
            fontWeight: "bold",
            fontSize: "1rem",
            marginBottom: "5px",
        },
        pointer: {
            cursor: "pointer",
        },
        orderInfo: {
            padding: "15px",
            fontSize: "1rem",
            lineHeight: "1.5rem",
        },
        orderTime: {
            marginBottom: "0.4rem",
        },
        products: {
            marginBottom: "0.4rem",
        },
        cell: {
            textAlign: "center",
        },
    })
);
const StyledTableRow = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "&:nth-of-type(even)": {
                backgroundColor: "#f3f3f3",
            },
            "&:nth-of-type(odd)": {
                backgroundColor: "#fff",
            },
        },
    })
)(TableRow);

const getProductNames = (order: OrderByCustomer) => {
    // oldProductsNames : 자료 이관으로 넣은 과거 데이터, 문자열 형태에 구매 상품 정보가 담겨있음.
    if (order.oldProducts) {
        return order.oldProducts;
    }
    const productNames = order.products.reduce(
        (acc, product) => `${acc}${product.name}${product.amount > 1 ? ` x ${product.amount}` : ``}, `,
        ""
    );
    return productNames.substring(0, productNames.length - 2);
};

const calculateOrderPrice = (order: OrderByCustomer) => {
    // oldPrice : 자료 이관으로 넣은 과거 데이터, 상품 총 합계를 의미
    if (order.oldPrice) {
        return parseInt(order.oldPrice.replace(",", ""));
    }
    return order.products.reduce((acc, product) => acc + product.price * product.amount, 0);
};

const calculateOrdersTotalPrice = (orders: OrderByCustomer[]) => {
    return orders.reduce((acc, order) => acc + calculateOrderPrice(order), 0);
};

const PreviousOrderList = () => {
    const classes = useStyles();
    const { ordersByCustomer } = useCustomerForm();
    const [selectedOrder, setSelectedOrder] = useState<OrderByCustomer | null>(null);

    const handleOrderClick = useCallback(
        (e) => {
            const index = +e.target.dataset.index;
            setSelectedOrder(ordersByCustomer[index]);
        },
        [ordersByCustomer]
    );

    useEffect(() => {
        if (ordersByCustomer.length > 0) {
            setSelectedOrder(ordersByCustomer[0]);
        } else {
            setSelectedOrder(null);
        }
    }, [ordersByCustomer]);

    return (
        <>
            <div className={classes.head}>
                이전 주문 목록{" "}
                {ordersByCustomer.length > 0
                    ? `( 총 ${ordersByCustomer.length} 건, 누적 금액 ${calculateOrdersTotalPrice(
                          ordersByCustomer
                      ).toLocaleString()} 원 )`
                    : ""}
            </div>
            <Grid container>
                <Grid item xs={5}>
                    <TableContainer className={clsx(classes.container, classes.pointer)}>
                        <Table stickyHeader>
                            <TableBody>
                                {ordersByCustomer.map((order, rowIndex) => {
                                    const { orderTime } = order;
                                    return (
                                        <StyledTableRow hover role="checkbox" key={rowIndex}>
                                            <TableCell
                                                key={orderTime}
                                                onClick={handleOrderClick}
                                                data-index={rowIndex}
                                                className={classes.cell}
                                            >
                                                {timeToFullFormatString(orderTime).split(",")[0]}
                                            </TableCell>
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={7}>
                    {selectedOrder && (
                        <div className={classes.orderInfo}>
                            <div className={classes.orderTime}>{timeToFullFormatString(selectedOrder.orderTime)}</div>
                            <div className={classes.products}>주문 내역 : {getProductNames(selectedOrder)}</div>
                            <div>요청사항 : {selectedOrder.orderRequest}</div>
                            <div>결제방법 : {selectedOrder.paymentMethod}</div>
                            <div>가격 : {calculateOrderPrice(selectedOrder).toLocaleString()}</div>
                        </div>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default memo(PreviousOrderList);
