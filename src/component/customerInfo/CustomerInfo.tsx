import { useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import AccountBox from "@material-ui/icons/AccountBox";
import Phone from "@material-ui/icons/Phone";
import Home from "@material-ui/icons/Home";
import Comment from "@material-ui/icons/Comment";
import { insertDashIntoPhoneNumber } from "util/phone";

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
            width: "400px",
        },
        request: {
            width: "400px",
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

const CustomerInfo = () => {
    const classes = useStyles();
    const [phoneNumber, setPhoneNumber] = useState("");
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };
    return (
        <Paper className={classes.paper}>
            <div className={classes.head}>고객정보</div>
            <StyledTextField label="이름" icon={<AccountBox />} />
            <StyledTextField
                label="전화"
                value={insertDashIntoPhoneNumber(phoneNumber)}
                handlePhoneNumberChange={handlePhoneNumberChange}
                icon={<Phone />}
            />
            <StyledTextField label="주소" className={classes.address} icon={<Home />} />
            <StyledTextField label="단골 요청사항" className={classes.request} icon={<Comment />} />
        </Paper>
    );
};

export default CustomerInfo;
