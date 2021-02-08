import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DragProductList from "component/DragProductList/index";
import { categories } from "component/DragProductList/data";
import ProductManagement from "component/ProductManagement";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            backgroundColor: theme.palette.primary.light,
        },
        leftSide: {
            width: "50%",
        },
        rightSide: {
            width: "50%",
            paddingLeft: "10px",
        },
    })
);

interface Props {}

export const ProductManagementPage = (props: Props) => {
    const classes = useStyles();
    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <DragProductList initial={categories} />
                </Box>
                <Box className={classes.rightSide}>
                    <ProductManagement />
                </Box>
            </Box>
        </Paper>
    );
};
