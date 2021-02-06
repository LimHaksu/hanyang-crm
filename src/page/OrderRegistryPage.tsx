import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import ProductList from "component/productList/ProductLIst";
import CustomerInfo from "component/customerInfo/CustomerInfo";
import OrderInfo from "component/orderInfo/OrderInfo";
import SubmitOrder from "component/submitOrder/SubmitOrder";

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
        },
    })
);

export const OrderRegistryPage = () => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <ProductList />
                </Box>
                <Box className={classes.rightSide} flexGrow={1} display="flex" flexDirection="column">
                    <Box>
                        <CustomerInfo />
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
