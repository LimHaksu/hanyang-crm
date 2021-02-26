import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DragProductList from "component/DragProductList/index";
import ProductManagement from "component/ProductManagement";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            backgroundColor: theme.palette.primary.light,
        },
        leftSide: {
            width: '45%'
        },
        rightSide: {
            width: '40%',
            paddingLeft: "10px",
        },
    })
);

export const ProductManagementPage = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Box display="flex" justifyContent="center">
                <Box className={classes.leftSide}>
                    <DragProductList />
                </Box>
                <Box className={classes.rightSide}>
                    <ProductManagement />
                </Box>
            </Box>
        </Paper>
    );
};
