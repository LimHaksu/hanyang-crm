import { useCallback, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import AccountBox from "@material-ui/icons/AccountBox";
import Grid from "@material-ui/core/Grid";
import Phone from "@material-ui/icons/Phone";
import Home from "@material-ui/icons/Home";
import Comment from "@material-ui/icons/Comment";
import { PayloadAction } from "typesafe-actions";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { CustomerForm, SET_CUSTOMER_ORDER_FORM, SET_CUSTOMER_MANAGEMENT_FORM } from "module/customer";
import { insertDashIntoPhoneNumber } from "util/phone";
import useCustomerForm from "hook/useCustomerForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        address: {
            width: "100%",
        },
        request: {
            width: "100%",
        },
        icon: {
            marginTop: 25,
        },
        fullWidth: {
            width: "calc(100% - 42px)",
        },
    })
);

interface StyledTextFieldProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
}

const StyledTextField = ({
    label,
    icon,
    className,
    value,
    onChange,
    onKeyDown,
    error,
    helperText,
    fullWidth,
}: StyledTextFieldProp) => {
    const classes = useStyles();

    return (
        <Grid container spacing={1}>
            <Grid item className={classes.icon}>
                {icon}
            </Grid>
            <Grid item className={fullWidth ? classes.fullWidth : ""}>
                <TextField
                    label={label}
                    className={className}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    error={error}
                    helperText={helperText}
                />
            </Grid>
        </Grid>
    );
};

interface InputsProp {
    customerForm: CustomerForm;
    setCustomerForm: (
        customerForm: CustomerForm
    ) => PayloadAction<typeof SET_CUSTOMER_ORDER_FORM | typeof SET_CUSTOMER_MANAGEMENT_FORM, CustomerForm>;
}
const Inputs = ({ customerForm, setCustomerForm }: InputsProp) => {
    const classes = useStyles();
    const { autoCompleteCustomerOrderForm, getOrdersByCustomer, resetOrdersByCustomer } = useCustomerForm();

    useEffect(() => {
        if (customerForm.idx >= 0) {
            getOrdersByCustomer(customerForm.idx);
        } else {
            resetOrdersByCustomer();
        }
    }, [customerForm.idx, getOrdersByCustomer, resetOrdersByCustomer]);

    const handleCustomerNameChange = useCallback(
        (e) => {
            const customerName = e.target.value;
            setCustomerForm({
                idx: customerForm.idx,
                address: customerForm.address,
                customerName,
                phoneNumber: customerForm.phoneNumber,
                request: customerForm.request,
            });
        },
        [setCustomerForm, customerForm.idx, customerForm.address, customerForm.phoneNumber, customerForm.request]
    );
    const handlePhoneNumberChange = useCallback(
        (e) => {
            const customerPhoneNumber = insertDashIntoPhoneNumber(e.target.value);
            setCustomerForm({
                idx: customerForm.idx,
                address: customerForm.address,
                customerName: customerForm.customerName,
                phoneNumber: customerPhoneNumber,
                request: customerForm.request,
            });
        },
        [setCustomerForm, customerForm.idx, customerForm.address, customerForm.customerName, customerForm.request]
    );
    const handleAddressChange = useCallback(
        (e) => {
            const address = e.target.value;
            setCustomerForm({
                idx: customerForm.idx,
                address,
                customerName: customerForm.customerName,
                phoneNumber: customerForm.phoneNumber,
                request: customerForm.request,
            });
        },
        [setCustomerForm, customerForm.idx, customerForm.customerName, customerForm.phoneNumber, customerForm.request]
    );
    const handleRequestChange = useCallback(
        (e) => {
            const request = e.target.value;
            setCustomerForm({
                idx: customerForm.idx,
                address: customerForm.address,
                customerName: customerForm.customerName,
                phoneNumber: customerForm.phoneNumber,
                request,
            });
        },
        [setCustomerForm, customerForm.idx, customerForm.customerName, customerForm.phoneNumber, customerForm.address]
    );

    const handlePhoneNumberEnter = useCallback(
        (e) => {
            const { key } = e;
            if (key === "Enter") {
                autoCompleteCustomerOrderForm({ searchBy: "phoneNumber", keyword: e.target.value });
            }
        },
        [autoCompleteCustomerOrderForm]
    );
    const validatePhoneNumber = useCallback(() => !!customerForm.phoneNumber, [customerForm.phoneNumber]);
    const validateAddress = useCallback(() => !!customerForm.address, [customerForm.address]);
    const { customerName, phoneNumber, address, request } = customerForm;
    return (
        <>
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
                        onChange={handlePhoneNumberChange}
                        onKeyDown={handlePhoneNumberEnter}
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
                fullWidth
            />
            <StyledTextField
                label="단골 요청사항"
                className={classes.request}
                icon={<Comment />}
                value={request ? request : ""}
                onChange={handleRequestChange}
                fullWidth
            />
        </>
    );
};

export default Inputs;
