import { useState, useCallback, useRef } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Radio, { RadioProps } from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Comment from "@material-ui/icons/Comment";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import Print from "@material-ui/icons/Print";
import useOrder from "hook/useOrder";
import useCustomerForm from "hook/useCustomerForm";
import usePhone from "hook/usePhone";
import usePrinter from "hook/usePrinter";
import { Product } from "module/product";
import { PaymentMethod, Order, OrderForm } from "module/order";
import { CustomerForm } from "module/customer";
import { print } from "util/printer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        submitPage: {
            padding: "15px",
            boxSizing: "border-box",
        },
        root: {
            "&:hover": {
                backgroundColor: "transparent",
            },
        },
        request: {
            width: "400px",
        },
        button: {
            "input:hover ~ &": {
                border: "1px solid #298d63",
                backgroundColor: "#F7FBF9",
            },
        },
        checkedButton: {
            "input:hover ~ &": {
                backgroundColor: "#1C6245",
            },
        },
        paymentMethod: {
            margin: "auto 0",
        },
        submitButton: {
            width: 100,
            height: 50,
            margin: "20px 0 0 20px",
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        printIcon: {
            color: "#fff",
        },
    })
);

interface StyledTextFieldProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledTextField = ({ label, icon, className, value, onChange }: StyledTextFieldProp) => {
    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <TextField
                    id="input-with-icon-grid"
                    label={label}
                    className={className}
                    value={value}
                    onChange={onChange}
                />
            </Grid>
        </Grid>
    );
};

// Inspired by blueprintjs
const StyledRadio = (props: RadioProps & { label: string }) => {
    const classes = useStyles();

    return (
        <Radio
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={
                <Button className={classes.checkedButton} variant="contained" color="primary">
                    {props.label}
                </Button>
            }
            icon={
                <Button className={classes.button} variant="outlined" color="primary">
                    {props.label}
                </Button>
            }
            {...props}
        />
    );
};

const orderValidate = (customerOrderForm: CustomerForm, orderForm: OrderForm) => {
    return customerOrderForm.phoneNumber && customerOrderForm.address && orderForm.products.length > 0;
};

type SelectedPayment = "cash" | "card" | "prePayment";
type SelectedPrepayment = "Baemin" | "Yogiyo" | "Coupang";

const paymentMap: { [key: string]: PaymentMethod } = {
    cash: "현금",
    card: "카드",
    prePaymentBaemin: "선결제(배민)",
    prePaymentYogiyo: "선결제(요기요)",
    prePaymentCoupang: "선결제(쿠팡)",
};

const SubmitOrder = () => {
    const classes = useStyles();
    const { customerOrderForm, setCustomerOrderForm } = useCustomerForm();
    const {
        orders,
        orderForm,
        changeOrderRequest,
        changePaymentMethod,
        submitOrder,
        editOrder,
        setOrderForm,
        isOrderEditMode,
        setOrderEditMode,
    } = useOrder();
    const { papersOptions, papersContents, printerOption } = usePrinter();
    const { products, orderRequest, paymentMethod } = orderForm;
    const [selectedPayment, setSelectedPayment] = useState<SelectedPayment>(() => {
        switch (orderForm.paymentMethod) {
            case "현금":
                return "cash";
            case "카드":
                return "card";
            default:
                return "prePayment";
        }
    });
    const [selectedPrepayment, setSelectedPrepayment] = useState<SelectedPrepayment>(() => {
        switch (orderForm.paymentMethod) {
            case "선결제(배민)":
                return "Baemin";
            case "선결제(요기요)":
                return "Yogiyo";
            case "선결제(쿠팡)":
                return "Coupang";
            default:
                return "Baemin";
        }
    });

    const prePaymentRef = useRef<HTMLElement>(null);

    const handleOrderRequestChange = useCallback(
        (e) => {
            changeOrderRequest(e.target.value);
        },
        [changeOrderRequest]
    );

    const handlePaymentMethodChange = useCallback(
        (e) => {
            let value = e.target.value;
            setSelectedPayment(value);
            if (value === "prePayment") {
                value += selectedPrepayment;
                setTimeout(() => {
                    prePaymentRef.current?.click();
                }, 0);
            }
            const paymentMethod = paymentMap[value];
            changePaymentMethod(paymentMethod);
        },
        [changePaymentMethod, selectedPrepayment]
    );

    const handlePrePaymentChange = useCallback(
        (e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
            const value = e.target.value as SelectedPrepayment;
            setSelectedPrepayment(value);

            const newPaymentMethod = paymentMap["prePayment" + value];
            changePaymentMethod(newPaymentMethod);
        },
        [changePaymentMethod]
    );

    const calculateTotalPrice = useCallback((products: (Product & { amount: number })[]) => {
        return products.reduce((acc, { price, amount }) => acc + price * amount, 0);
    }, []);

    const handleCancelButtonClick = useCallback(() => {
        setSelectedPayment("cash");
        setSelectedPrepayment("Baemin");
        setOrderEditMode(false);
        setCustomerOrderForm({ idx: -1, address: "", customerName: "", phoneNumber: "", request: "" });
        setOrderForm({
            idx: -1,
            orderRequest: "",
            orderTime: -1,
            paymentMethod: "현금",
            products: [],
            phoneCallRecordIdx: -1,
        });
    }, [setCustomerOrderForm, setOrderForm, setOrderEditMode]);

    const handleSaveButtonClick = useCallback(() => {
        const { customerName, phoneNumber, address, request: customerRequest, idx: customerIdx } = customerOrderForm;
        const { products, orderRequest, paymentMethod, idx: orderIdx, orderTime, phoneCallRecordIdx } = orderForm;
        if (isOrderEditMode) {
            // 주문 수정
            const order: Order = {
                idx: orderIdx,
                address,
                customerIdx,
                customerName,
                customerRequest,
                orderRequest,
                orderTime,
                paymentMethod,
                phoneNumber,
                products,
                phoneCallRecordIdx,
            };
            editOrder(order);
        } else {
            // 새로운 주문을 하는 순간에는 idx, orderTime, customerIdx 필요 없음
            const order: Omit<Order, "idx" | "orderTime" | "customerIdx"> = {
                customerName,
                phoneNumber,
                address,
                customerRequest,
                products,
                orderRequest,
                paymentMethod,
                phoneCallRecordIdx,
            };
            submitOrder(order);
        }
        // 주문 폼 초기화
        handleCancelButtonClick();
    }, [customerOrderForm, orderForm, isOrderEditMode, handleCancelButtonClick, editOrder, submitOrder]);

    const handlePrintSaveButtonClick = useCallback(() => {
        const { address, request: customerRequest, phoneNumber } = customerOrderForm;
        const { idx, products, orderRequest, paymentMethod, orderTime } = orderForm;

        const order = {
            products,
            orderTime,
            phoneNumber,
            address,
            customerRequest,
            orderRequest,
            paymentMethod,
        };
        // 주문 리스트에서 몇번째 주문인지 찾는 로직
        let index = orders.findIndex((o) => o.idx === idx); // index는 1부터
        if (index === -1) {
            index = orders.length;
        }
        papersOptions.forEach((paperOptions, paperIndex) => {
            const { printAvailable } = paperOptions;
            if (printAvailable) {
                print(index, order, papersContents[paperIndex], printerOption);
            }
        });

        handleSaveButtonClick();
    }, [customerOrderForm, handleSaveButtonClick, orderForm, orders, papersContents, papersOptions, printerOption]);

    return (
        <Paper className={classes.submitPage}>
            <Box display="flex" flexWrap="wrap" justifyContent="flex-end">
                <Box>
                    <StyledTextField
                        className={classes.request}
                        label="주문 요청사항"
                        icon={<Comment />}
                        value={orderRequest}
                        onChange={handleOrderRequestChange}
                    />
                    <Box display="flex" flexWrap="wrap">
                        <Box flexGrow={1} className={classes.paymentMethod}>
                            <RadioGroup
                                row
                                value={selectedPayment}
                                aria-label="gender"
                                name="customized-radios"
                                onChange={handlePaymentMethodChange}
                            >
                                <FormControlLabel value="cash" control={<StyledRadio label="현금" />} label="" />
                                <FormControlLabel value="card" control={<StyledRadio label="카드" />} label="" />
                                <FormControlLabel
                                    value="prePayment"
                                    control={<StyledRadio label="선결제" />}
                                    label=""
                                />
                            </RadioGroup>
                        </Box>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                            disabled={paymentMethod === "현금" || paymentMethod === "카드"}
                        >
                            <InputLabel id="select-outlined-label">선결제</InputLabel>
                            <Select
                                labelId="select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={selectedPrepayment}
                                onChange={handlePrePaymentChange}
                                label="선결제"
                                ref={prePaymentRef}
                            >
                                <MenuItem value="Baemin">배민</MenuItem>
                                <MenuItem value="Yogiyo">요기요</MenuItem>
                                <MenuItem value="Coupang">쿠팡</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h4" component="h2">
                        총 결제금액 : <span id="total-price">{calculateTotalPrice(products).toLocaleString()}</span>원
                    </Typography>
                    <Box display="flex" flexWrap="wrap">
                        <Box flexGrow={1}></Box>
                        <Button
                            className={clsx(classes.button, classes.submitButton)}
                            variant="contained"
                            color="primary"
                            disabled={!orderValidate(customerOrderForm, orderForm)}
                            onClick={handlePrintSaveButtonClick}
                        >
                            <Print className={classes.printIcon} /> 출력 {isOrderEditMode ? "수정" : "저장"}
                        </Button>
                        <Button
                            className={clsx(classes.button, classes.submitButton)}
                            variant="outlined"
                            color="primary"
                            onClick={handleSaveButtonClick}
                            disabled={!orderValidate(customerOrderForm, orderForm)}
                        >
                            {isOrderEditMode ? "수정" : "저장"}
                        </Button>
                        <Button
                            className={clsx(classes.button, classes.submitButton)}
                            variant="outlined"
                            color="primary"
                            onClick={handleCancelButtonClick}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default SubmitOrder;
