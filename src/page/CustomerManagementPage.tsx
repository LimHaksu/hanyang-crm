import React from "react";
import { withStyles, makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import CustomerSearch from "component/CustomerSearch";
import Button from "@material-ui/core/Button";
import CustomerInfo from "component/CustomerInfo";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            backgroundColor: theme.palette.primary.light,
        },
        leftSide: {
            width: "60%",
        },
        rightSide: {
            width: "40%",
            paddingLeft: "10px",
        },
        container: {
            maxHeight: "calc(100vh - 161px)",
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
        clickableCell: {
            cursor: "pointer",
        },
        submitArea: {
            padding: 15,
        },
        submitButton: {
            marginRight: 10,
        },
    })
);

interface Column {
    id: "idx" | "customerName" | "phoneNumber" | "address" | "edit" | "remove";
    label: string;
    width?: number;
    minWidth?: number;
    align?: "center";
}

interface Data {
    idx: number;
    customerName: string;
    phoneNumber: string;
    address: string;
    edit: string;
    remove: string;
}

const columns: Column[] = [
    { id: "idx", label: "순서", width: 40, minWidth: 40, align: "center" },
    { id: "customerName", label: "고객명", minWidth: 95, align: "center" },
    { id: "phoneNumber", label: "전화번호", minWidth: 130, align: "center" },
    {
        id: "address",
        label: "주소",
        minWidth: 300,
        align: "center",
    },
    {
        id: "edit",
        label: "수정",
        minWidth: 40,
        width: 40,
        align: "center",
    },
    {
        id: "remove",
        label: "삭제",
        minWidth: 40,
        width: 40,
        align: "center",
    },
];

function createData(
    idx: number,
    customerName: string,
    phoneNumber: string,
    address: string,
    edit: string = "✏️",
    remove: string = "❌"
): Data {
    return { idx, customerName, phoneNumber, address, edit, remove };
}

const rows = [
    createData(1, "손님", "010-1234-5678", "중구 선화동 123-456번지 선화아파트 101동 1001호"),
    createData(2, "손님", "010-1234-5678", "중구 선화동 123-456번지 선화아파트 101동 1001호"),
];

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

const isClickableCell = (id: string) => {
    return id === "edit" || id === "remove";
};

export const CustomerManagementPage = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <CustomerSearch />
                    <Paper>
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
                                                        <TableCell
                                                            className={clsx(
                                                                classes.cell,
                                                                isClickableCell(column.id) && classes.clickableCell
                                                            )}
                                                            key={column.id}
                                                            align={column.align}
                                                        >
                                                            {value}
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
                </Box>
                <Box className={classes.rightSide}>
                    <Box>
                        <CustomerInfo />
                    </Box>
                    <Box>
                        <Paper className={classes.submitArea}>
                            <Box display="flex" justifyContent="flex-end">
                                <Box>
                                    <Button className={classes.submitButton} variant="contained" color="primary">
                                        등록
                                    </Button>
                                </Box>
                                <Box>
                                    <Button variant="outlined" color="primary">
                                        취소
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
