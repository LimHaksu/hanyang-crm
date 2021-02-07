import { makeStyles, createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";

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
    })
);

const isClickableCell = (id: string) => {
    return id === "remove";
};

interface Column {
    id: "idx" | "productName" | "price" | "amount" | "productTotalPrice" | "remove";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
    priceAlign?: "right";
    getRegistryTextWithEmoji?: (value: string) => string;
    formatPrice?: (price: number) => string;
}

interface Data {
    idx: number;
    productName: string;
    price: number;
    amount: number;
    productTotalPrice: number;
    remove: string;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "productName", label: "상품명", minWidth: 95, align: "center" },
    { id: "price", label: "가격", minWidth: 95, align: "center", formatPrice: (price) => price.toLocaleString() },
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
        formatPrice: (price) => price.toLocaleString(),
    },
    {
        id: "remove",
        label: "삭제",
        width: 38,
        minWidth: 38,
        align: "center",
    },
];

function createData(
    idx: number,
    productName: string,
    price: number,
    amount: number,
    productTotalPrice: number,
    remove: string = "❌"
): Data {
    return { idx, productName, price, amount, productTotalPrice, remove };
}

const rows = [createData(1, "족발小", 30000, 1, 30000), createData(2, "1인보쌈", 20000, 2, 40000)];

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
                        {rows.map((row) => {
                            return (
                                <StyledTableRow hover role="checkbox" key={row.idx}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell
                                                className={clsx(
                                                    classes.cell,
                                                    isClickableCell(column.id) && classes.clickableCell
                                                )}
                                                key={column.id}
                                                align={column.align}
                                            >
                                                {column.formatPrice && typeof value === "number"
                                                    ? column.formatPrice(value)
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
};

export default OrderInfo;
