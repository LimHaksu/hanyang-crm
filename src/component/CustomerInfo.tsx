import React, { useCallback } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { PayloadAction } from "typesafe-actions";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AccountBox from "@material-ui/icons/AccountBox";
import Phone from "@material-ui/icons/Phone";
import Home from "@material-ui/icons/Home";
import Comment from "@material-ui/icons/Comment";
import { insertDashIntoPhoneNumber } from "util/phone";
import { CustomerForm, SET_CUSTOMER_ORDER_FORM, SET_CUSTOMER_MANAGEMENT_FORM } from "module/customer";

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
            marginBottom: "5px",
        },
        address: {
            width: "438px",
        },
        request: {
            width: "438px",
        },
        icon: {
            marginTop: 25,
        },
    })
);

interface StyledTextFieldProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
}

const StyledTextField = ({ label, icon, className, value, onChange, error, helperText }: StyledTextFieldProp) => {
    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            <Grid item className={classes.icon}>
                {icon}
            </Grid>
            <Grid item>
                <TextField
                    label={label}
                    className={className}
                    value={value}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                />
            </Grid>
        </Grid>
    );
};

interface CustomerInfoProp {
    customerForm: CustomerForm;
    setCustomerForm: (
        idx: number | undefined,
        customerName: string,
        phoneNumber: string,
        address: string,
        request: string
    ) => PayloadAction<typeof SET_CUSTOMER_ORDER_FORM | typeof SET_CUSTOMER_MANAGEMENT_FORM, CustomerForm>;
}

const CustomerInfo = ({ customerForm, setCustomerForm }: CustomerInfoProp) => {
    const classes = useStyles();

    const handleCustomerNameChange = useCallback(
        (e) => {
            const customerName = e.target.value;
            setCustomerForm(
                customerForm.idx,
                customerName,
                customerForm.phoneNumber,
                customerForm.address,
                customerForm.request
            );
        },
        [setCustomerForm, customerForm.idx, customerForm.address, customerForm.phoneNumber, customerForm.request]
    );
    const handlePhoneNumberChange = useCallback(
        (e) => {
            const customerPhoneNumber = insertDashIntoPhoneNumber(e.target.value);
            setCustomerForm(
                customerForm.idx,
                customerForm.customerName,
                customerPhoneNumber,
                customerForm.address,
                customerForm.request
            );
        },
        [setCustomerForm, customerForm.idx, customerForm.address, customerForm.customerName, customerForm.request]
    );
    const handleAddressChange = useCallback(
        (e) => {
            const address = e.target.value;
            setCustomerForm(
                customerForm.idx,
                customerForm.customerName,
                customerForm.phoneNumber,
                address,
                customerForm.request
            );
        },
        [setCustomerForm, customerForm.idx, customerForm.customerName, customerForm.phoneNumber, customerForm.request]
    );
    const handleRequestChange = useCallback(
        (e) => {
            const request = e.target.value;
            setCustomerForm(
                customerForm.idx,
                customerForm.customerName,
                customerForm.phoneNumber,
                customerForm.address,
                request
            );
        },
        [setCustomerForm, customerForm.idx, customerForm.customerName, customerForm.phoneNumber, customerForm.address]
    );

    const validatePhoneNumber = useCallback(() => !!customerForm.phoneNumber, [customerForm.phoneNumber]);
    const validateAddress = useCallback(() => !!customerForm.address, [customerForm.address]);

    const { customerName, phoneNumber, address, request } = customerForm;
    return (
        <Paper className={classes.paper}>
            <div className={classes.head}>고객정보</div>
            <Grid container spacing={2}>
                <Grid item>
                    <StyledTextField
                        label="이름"
                        icon={<AccountBox />}
                        value={customerName ? customerName : ""}
                        onChange={handleCustomerNameChange}
                    />
                </Grid>
                <Grid item>
                    <StyledTextField
                        label="전화"
                        // value={insertDashIntoPhoneNumber(phoneNumber)}
                        onChange={handlePhoneNumberChange}
                        icon={<Phone />}
                        value={phoneNumber}
                        error={!validatePhoneNumber()}
                        helperText={!validatePhoneNumber() ? "전화번호는 반드시 입력해야합니다." : undefined}
                    />
                </Grid>
            </Grid>
            <StyledTextField
                label="주소"
                className={classes.address}
                icon={<Home />}
                value={address ? address : ""}
                onChange={handleAddressChange}
                error={!validateAddress()}
                helperText={!validateAddress() ? "주소는 반드시 입력해야합니다." : undefined}
            />
            <StyledTextField
                label="단골 요청사항"
                className={classes.request}
                icon={<Comment />}
                value={request ? request : ""}
                onChange={handleRequestChange}
            />
        </Paper>
    );
};

export default React.memo(CustomerInfo);
