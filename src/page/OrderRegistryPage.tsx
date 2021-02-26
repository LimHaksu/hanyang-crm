import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ProductList from "component/ProductLIst";
import CustomerInfo from "component/CustomerInfo";
import OrderInfo from "component/OrderInfo";
import SubmitOrder from "component/SubmitOrder";
import useCustomerForm from "hook/useCustomerForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            backgroundColor: theme.palette.primary.light,
        },
        leftSide: {
            width: "33%",
        },
        rightSide: {
            width: "50%",
            paddingLeft: "10px",
        },
    })
);

export const OrderRegistryPage = () => {
    const classes = useStyles();
    const { customerOrderForm, setCustomerOrderForm } = useCustomerForm();

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
        </Paper>
    );
};
