import { useState } from "react";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        submitPage: {
            height: "150px",
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
        icon: {
            "input:hover ~ &": {
                backgroundColor: "#e1f3eb",
            },
        },
        checkedIcon: {
            "input:hover ~ &": {
                backgroundColor: "#277e5a",
            },
        },
        button: {
            width: 100,
            height: 50,
            margin: "20px 5px 0 20px",
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    })
);

interface StyledTextFieldProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
    handlePhoneNumberChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledTextField = ({ label, icon, className, value, handlePhoneNumberChange }: StyledTextFieldProp) => {
    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <TextField
                    id="input-with-icon-grid"
                    label={label}
                    className={className}
                    value={value}
                    onChange={handlePhoneNumberChange}
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
                <Button className={classes.checkedIcon} variant="contained" color="primary">
                    {props.label}
                </Button>
            }
            icon={
                <Button className={classes.icon} variant="outlined" color="primary">
                    {props.label}
                </Button>
            }
            {...props}
        />
    );
};

type SelectedPrepayment = "배민" | "요기요" | "쿠팡";

const SubmitOrder = () => {
    const classes = useStyles();
    const [selectedPrepayment, setSelectedPrepayment] = useState<SelectedPrepayment>("배민");
    return (
        <Paper className={classes.submitPage}>
            <Box display="flex">
                <Box flexGrow={1}></Box>
                <Box>
                    <StyledTextField className={classes.request} label="주문 요청사항" icon={<Comment />} />
                    <Box display="flex">
                        <RadioGroup row defaultValue="cash" aria-label="gender" name="customized-radios">
                            <FormControlLabel value="cash" control={<StyledRadio label="현금" />} label="" />
                            <FormControlLabel value="card" control={<StyledRadio label="카드" />} label="" />
                            <FormControlLabel value="prePayment" control={<StyledRadio label="선결제" />} label="" />
                        </RadioGroup>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">선결제</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={selectedPrepayment}
                                onChange={(e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>) => {
                                    setSelectedPrepayment(e.target.value as SelectedPrepayment);
                                }}
                                label="배민"
                            >
                                <MenuItem value="배민">배민</MenuItem>
                                <MenuItem value="요기요">요기요</MenuItem>
                                <MenuItem value="쿠팡">쿠팡</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h4" component="h2">
                        총 결제금액 : <span id="total-price">{Number(70000).toLocaleString()}</span>원
                    </Typography>
                    <Box display="flex">
                        <Box flexGrow={1}></Box>
                        <Button
                            className={clsx(classes.checkedIcon, classes.button)}
                            variant="contained"
                            color="primary"
                        >
                            저장
                        </Button>
                        <Button className={clsx(classes.icon, classes.button)} variant="outlined" color="primary">
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default SubmitOrder;
