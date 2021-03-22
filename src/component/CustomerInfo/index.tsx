import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { PayloadAction } from "typesafe-actions";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { CustomerForm, SET_CUSTOMER_ORDER_FORM, SET_CUSTOMER_MANAGEMENT_FORM } from "module/customer";
import Inputs from "./Inputs";
import PreviousOrderList from "./PreviousOrderList";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        paper: {
            padding: "15px",
            boxSizing: "border-box",
            height: "250px",
        },
        head: {
            fontWeight: "bold",
            fontSize: "1.1rem",
            marginBottom: "5px",
        },
    })
);

interface CustomerInfoProp {
    customerForm: CustomerForm;
    setCustomerForm: (
        customerForm: CustomerForm
    ) => PayloadAction<typeof SET_CUSTOMER_ORDER_FORM | typeof SET_CUSTOMER_MANAGEMENT_FORM, CustomerForm>;
}
const CustomerInfo = ({ customerForm, setCustomerForm }: CustomerInfoProp) => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container>
                <Grid item xs={6}>
                    <div className={classes.head}>고객정보</div>
                    <Inputs customerForm={customerForm} setCustomerForm={setCustomerForm} />
                </Grid>
                <Grid item xs={6}>
                    <PreviousOrderList />
                </Grid>
            </Grid>
        </Paper>
    );
};

export default React.memo(CustomerInfo);
