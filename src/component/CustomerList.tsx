import React, { useCallback, useState } from "react";
import { withStyles, makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Box from "@material-ui/core/Box";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import Modal from "component/Modal";
import clsx from "clsx";
import { Customer, CustomerForm } from "module/customer";
import useCustomer from "hook/useCustomer";
import useCustomerForm from "hook/useCustomerForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            maxHeight: "calc(100vh - 161px)",
            backgroundColor: "#fff",
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
            "&:hover": {
                cursor: "pointer",
                "& svg": {
                    color: "#ff0055",
                },
            },
        },
        modalMessage: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            lineHeight: "2rem",
            marginBottom: "10px",
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

interface CustomerListProp {
    customers: Customer[];
}

const CustomerList = ({ customers }: CustomerListProp) => {
    const classes = useStyles();
    const { removeCustomer } = useCustomer();
    const { setCustomerManagementForm, setCustomerManagementFormEditMode } = useCustomerForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedCustomer, setClickedCustomer] = useState<Customer>();

    const handleEditClick = useCallback(
        (customerManagementForm: CustomerForm) => () => {
            setCustomerManagementForm(customerManagementForm);
            setCustomerManagementFormEditMode(true);
        },
        [setCustomerManagementForm, setCustomerManagementFormEditMode]
    );

    const handleDeleteClick = useCallback(
        (customer: Customer) => () => {
            setClickedCustomer(customer);
            setIsModalOpen(true);
        },
        []
    );

    const handleDeleteOkClick = useCallback(() => {
        removeCustomer(clickedCustomer?.idx!);
        setCustomerManagementForm({ idx: -1, address: "", customerName: "", phoneNumber: "", request: "" });
        setCustomerManagementFormEditMode(false);
        setIsModalOpen(false);
    }, [removeCustomer, clickedCustomer, setCustomerManagementForm, setCustomerManagementFormEditMode]);

    const handleDeleteCancelClick = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <>
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
                        {customers.map((customer, rowIdx) => {
                            const { idx, customerName, phoneNumber, address, request } = customer;
                            return (
                                <StyledTableRow hover role="checkbox" key={customer.idx}>
                                    {columns.map((column) => {
                                        if (column.id === "idx") {
                                            return (
                                                <TableCell
                                                    className={classes.cell}
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {rowIdx + 1}
                                                </TableCell>
                                            );
                                        }
                                        if (column.id === "edit") {
                                            return (
                                                <TableCell
                                                    key="edit"
                                                    className={clsx(classes.cell, classes.clickableCell)}
                                                    onClick={handleEditClick({
                                                        idx: idx!,
                                                        address,
                                                        customerName,
                                                        phoneNumber,
                                                        request,
                                                    })}
                                                >
                                                    <Edit />
                                                </TableCell>
                                            );
                                        }
                                        if (column.id === "remove") {
                                            return (
                                                <TableCell
                                                    key="remove"
                                                    className={clsx(classes.cell, classes.clickableCell)}
                                                    onClick={handleDeleteClick(customer)}
                                                >
                                                    <Delete />
                                                </TableCell>
                                            );
                                        }
                                        const value = customer[column.id];
                                        return (
                                            <TableCell className={classes.cell} key={column.id} align={column.align}>
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
            <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>
                        고객명 : {clickedCustomer?.customerName}
                        <br />
                        전화번호 : {clickedCustomer?.phoneNumber}
                        <br />
                        주소 : {clickedCustomer?.address}
                        <br />
                        정말로 삭제하시겠습니까?
                    </div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="outlined" color="primary" onClick={handleDeleteOkClick}>
                            예
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleDeleteCancelClick}>
                            아니오
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default React.memo(CustomerList);
