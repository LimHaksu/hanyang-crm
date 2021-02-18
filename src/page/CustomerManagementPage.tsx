import React, { useCallback } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import CustomerSearch from "component/CustomerSearch";
import Button from "@material-ui/core/Button";
import CustomerInfo from "component/CustomerInfo";
import CustomerList from "component/CustomerList";
import useCustomer from "hook/useCustomer";

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

const SubmitCustomer = () => {
    const classes = useStyles();
    const {
        customerManagementForm,
        setCustomerManagementForm,
        addCustomer,
        editCustomer,
        isCustomerManagementFormEditMode,
        setCustomerManagementFormEditMode,
    } = useCustomer();

    const handleSubmitButtonClick = useCallback(() => {
        const { idx, customerName, phoneNumber, address, request } = customerManagementForm;
        if (isCustomerManagementFormEditMode) {
            console.log(customerManagementForm);
            editCustomer(idx!, customerName, phoneNumber, address, request);
            setCustomerManagementFormEditMode(false);
        } else {
            addCustomer(customerName, phoneNumber, address, request);
        }
        setCustomerManagementForm(-1, "", "", "", "");
    }, [
        setCustomerManagementForm,
        editCustomer,
        addCustomer,
        customerManagementForm,
        isCustomerManagementFormEditMode,
        setCustomerManagementFormEditMode,
    ]);

    const handleCancelButtonClick = useCallback(() => {
        setCustomerManagementForm(-1, "", "", "", "");
        setCustomerManagementFormEditMode(false);
    }, [setCustomerManagementForm, setCustomerManagementFormEditMode]);

    const validate = useCallback(() => customerManagementForm.phoneNumber && customerManagementForm.address, [
        customerManagementForm.phoneNumber,
        customerManagementForm.address,
    ]);

    return (
        <Paper className={classes.submitArea}>
            <Box display="flex" justifyContent="flex-end">
                <Box>
                    <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitButtonClick}
                        disabled={!validate()}
                    >
                        {isCustomerManagementFormEditMode ? "수정" : "등록"}
                    </Button>
                </Box>
                <Box>
                    <Button variant="outlined" color="primary" onClick={handleCancelButtonClick}>
                        취소
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export const CustomerManagementPage = () => {
    const classes = useStyles();
    const { customers, customerManagementForm, setCustomerManagementForm } = useCustomer();

    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <CustomerSearch />
                    <CustomerList customers={customers} />
                </Box>
                <Box className={classes.rightSide}>
                    <CustomerInfo customerForm={customerManagementForm} setCustomerForm={setCustomerManagementForm} />
                    <SubmitCustomer />
                </Box>
            </Box>
        </Paper>
    );
};
