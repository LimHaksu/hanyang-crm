import React, { useCallback } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import CustomerSearch from "component/CustomerSearch";
import Button from "@material-ui/core/Button";
import CustomerInfo from "component/CustomerInfo";
import CustomerList from "component/CustomerList";
import Modal from "component/Modal";
import useCustomer from "hook/useCustomer";
import useCustomerForm from "hook/useCustomerForm";

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
        modalMessage: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            marginBottom: "20px",
        },
    })
);

const SubmitCustomer = () => {
    const classes = useStyles();
    const { addCustomer, editCustomer } = useCustomer();

    const {
        customerManagementForm,
        setCustomerManagementForm,
        isCustomerManagementFormEditMode,
        setCustomerManagementFormEditMode,
    } = useCustomerForm();

    const handleSubmitButtonClick = useCallback(() => {
        const { idx, customerName, phoneNumber, address, request } = customerManagementForm;
        if (isCustomerManagementFormEditMode) {
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

const Modals = () => {
    const classes = useStyles();
    const {
        isAddCustomerSuccess,
        isEditCustomerSuccess,
        isRemoveCustomerSuccess,
        setAddSuccess,
        setEditSuccess,
        setRemoveSuccess,
    } = useCustomer();

    const handleOkButtonClick = useCallback(
        (setSuccess) => () => {
            setSuccess(false);
        },
        []
    );

    return (
        <>
            <Modal open={isAddCustomerSuccess} setOpen={setAddSuccess}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>고객 정보 추가 성공</div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="contained" color="primary" onClick={handleOkButtonClick(setAddSuccess)}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isEditCustomerSuccess} setOpen={setEditSuccess}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>고객 정보 수정 성공</div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="contained" color="primary" onClick={handleOkButtonClick(setEditSuccess)}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal open={isRemoveCustomerSuccess} setOpen={setRemoveSuccess}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>고객 정보 삭제 성공</div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="contained" color="primary" onClick={handleOkButtonClick(setRemoveSuccess)}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export const CustomerManagementPage = () => {
    const classes = useStyles();
    const { customers } = useCustomer();
    const { customerManagementForm, setCustomerManagementForm } = useCustomerForm();
    return (
        <>
            <Paper className={classes.root}>
                <Box display="flex">
                    <Box className={classes.leftSide}>
                        <CustomerSearch />
                        <CustomerList customers={customers} />
                    </Box>
                    <Box className={classes.rightSide}>
                        <CustomerInfo
                            customerForm={customerManagementForm}
                            setCustomerForm={setCustomerManagementForm}
                        />
                        <SubmitCustomer />
                    </Box>
                </Box>
            </Paper>
            <Modals />
        </>
    );
};
