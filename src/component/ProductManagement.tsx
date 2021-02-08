import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import LabelIcon from "@material-ui/icons/Label";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import Money from "@material-ui/icons/Money";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            backgroundColor: theme.palette.primary.light,
        },
        category: {
            padding: 15,
            marginBottom: 10,
        },
        product: {
            padding: 15,
        },
        title: {
            fontSize: "1.3rem",
            fontWeight: "bold",
            marginBottom: 10,
        },
        textField: {
            width: "400px",
        },
        button: {
            margin: "10px 0 0 0",
        },
        box: {
            maxWidth: "fit-content",
        },
    })
);

interface StyledTextFieldProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
}

const StyledTextField = ({ label, icon, className, value }: StyledTextFieldProp) => {
    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <TextField label={label} className={className} value={value} />
            </Grid>
        </Grid>
    );
};

const ProductManagement = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Paper className={classes.category}>
                <div className={classes.title}>카테고리</div>
                <Box className={classes.box}>
                    <StyledTextField label="이름" icon={<LabelIcon />} className={classes.textField} />
                    <Box display="flex">
                        <Box flexGrow={1}></Box>
                        <Box>
                            <Button className={classes.button} variant="contained" color="primary">
                                추가
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
            <Paper className={classes.product}>
                <div className={classes.title}>상품</div>
                <Box className={classes.box}>
                    <StyledTextField label="이름" icon={<RestaurantMenuIcon />} className={classes.textField} />
                    <StyledTextField label="가격" icon={<Money />} />
                    <Box display="flex">
                        <Box flexGrow={1}></Box>
                        <Box>
                            <Button className={classes.button} variant="contained" color="primary">
                                추가
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Paper>
    );
};

export default ProductManagement;
