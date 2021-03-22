import { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ProductList from "component/ProductLIst";
import CustomerInfo from "component/CustomerInfo";
import OrderInfo from "component/OrderInfo";
import SubmitOrder from "component/SubmitOrder";
import useCustomerForm from "hook/useCustomerForm";
import Modal from "component/Modal";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            backgroundColor: theme.palette.primary.light,
        },
        leftSide: {
            width: "30%",
        },
        rightSide: {
            width: "70%",
            paddingLeft: "10px",
        },
        modalMessage: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            lineHeight: "2rem",
            marginBottom: "10px",
        },
    })
);

export const OrderRegistryPage = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const { customerOrderForm, setCustomerOrderForm, errorMessage, resetErrorMessage } = useCustomerForm();
    const okButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (errorMessage) {
            setOpen(true);
            setTimeout(() => {
                okButtonRef.current?.focus();
            }, 0);
        }
    }, [errorMessage]);

    const handleModalClose = useCallback(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        if (!open) {
            setTimeout(() => {
                resetErrorMessage();
            }, 200);
        }
    }, [open, resetErrorMessage]);

    return (
        <Paper className={classes.root}>
            <Box display="flex" justifyContent="center">
                <Box className={classes.leftSide}>
                    <ProductList />
                </Box>
                <Box className={classes.rightSide} display="flex" flexDirection="column">
                    <Box>
                        <CustomerInfo customerForm={customerOrderForm} setCustomerForm={setCustomerOrderForm} />
                    </Box>
                    <Box>
                        <OrderInfo />
                    </Box>
                    <Box>
                        <SubmitOrder />
                    </Box>
                </Box>
            </Box>
            <Modal open={open} setOpen={setOpen}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>{errorMessage}</div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="contained" color="primary" onClick={handleModalClose} ref={okButtonRef}>
                            확인
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Paper>
    );
};
