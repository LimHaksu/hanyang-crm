import { useCallback } from "react";
import { makeStyles, createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Delete from "@material-ui/icons/Delete";
import clsx from "clsx";
import useOrder from "hook/useOrder";
import { Product } from "module/product";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            height: "100%",
            padding: "15px",
            boxSizing: "border-box",
        },
        head: {
            fontWeight: "bold",
            fontSize: "1.1rem",
        },
        tableHead: {
            fontWeight: "bold",
            fontSize: "1.1rem",
        },
        container: {
            marginTop: "15px",
            maxHeight: "calc(100vh - 532px)",
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
        clickableCell: {
            cursor: "pointer",
        },
        amountTextField: {
            width: 40,
        },
    })
);

interface Column {
    id: "idx" | "name" | "price" | "amount" | "productTotalPrice" | "remove";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
    getRegistryTextWithEmoji?: (value: string) => string;
    formatPrice?: (price: number) => string;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "name", label: "상품명", minWidth: 95, align: "center" },
    { id: "price", label: "가격", minWidth: 95, align: "center" },
    {
        id: "amount",
        label: "수량",
        minWidth: 95,
        align: "center",
    },
    {
        id: "productTotalPrice",
        label: "합계",
        minWidth: 95,
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

const isClickableCell = (id: string) => {
    return id === "remove";
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

const OrderInfo = () => {
    const classes = useStyles();
    const { orderForm, changeAmount, removeProduct } = useOrder();
    const { products } = orderForm;

    const handleAmountChange = useCallback(
        (index) => (e: React.ChangeEvent<HTMLInputElement>) => {
            changeAmount(index, +e.target.value);
        },
        [changeAmount]
    );

    const handleRemoveClick = useCallback(
        (index: number) => () => {
            removeProduct(index);
        },
        [removeProduct]
    );

    const cellContent = useCallback(
        (columnId: string, product: Product & { amount: number }, index: number) => {
            switch (columnId) {
                case "idx":
                    return index + 1;
                case "name":
                    return product.name;
                case "price":
                    return product.price.toLocaleString();
                case "amount":
                    return (
                        <TextField
                            className={classes.amountTextField}
                            inputProps={{ style: { textAlign: "center" } }}
                            onChange={handleAmountChange(index)}
                            value={product.amount}
                        />
                    );
                case "productTotalPrice":
                    return (product.price * product.amount).toLocaleString();
                case "remove":
                    return <Delete />;
            }
        },
        [classes.amountTextField, handleAmountChange]
    );

    return (
        <Paper className={classes.paper}>
            <div className={classes.head}>주문정보</div>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    className={clsx(classes.cell, classes.tableHead)}
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
                        {products &&
                            products.map((product, index) => {
                                return (
                                    <StyledTableRow hover role="checkbox" key={product.idx}>
                                        {columns.map((column) => (
                                            <TableCell
                                                className={clsx(
                                                    classes.cell,
                                                    isClickableCell(column.id) && classes.clickableCell
                                                )}
                                                key={column.id}
                                                align={column.align}
                                                onClick={
                                                    isClickableCell(column.id) ? handleRemoveClick(index) : () => {}
                                                }
                                            >
                                                {cellContent(column.id, product, index)}
                                            </TableCell>
                                        ))}
                                    </StyledTableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default OrderInfo;
