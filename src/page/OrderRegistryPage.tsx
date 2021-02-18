import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ProductList from "component/ProductLIst";
import CustomerInfo from "component/CustomerInfo";
import OrderInfo from "component/OrderInfo";
import SubmitOrder from "component/SubmitOrder";
import useCustomer from "hook/useCustomer";

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
    })
);

export const OrderRegistryPage = () => {
    const classes = useStyles();
    const { customerOrderForm, setCustomerOrderForm } = useCustomer();
    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <ProductList />
                </Box>
                <Box className={classes.rightSide} flexGrow={1} display="flex" flexDirection="column">
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
