import { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import DragProductList from "component/DragProductList/index";
import ProductManagement from "component/ProductManagement";
import useProduct from "hook/useProduct";

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

export const ProductManagementPage = () => {
    const classes = useStyles();
    const { categories, setLastCategoryIdx, setLastProductIdx } = useProduct();

    useEffect(() => {
        const lastCategoryIdx = Math.max(...categories.map((category) => category.idx));
        setLastCategoryIdx(lastCategoryIdx);
        const lastProductIdx = Math.max(
            ...categories.map((category) => Math.max(...category.products.map((product) => product.idx)))
        );
        setLastProductIdx(lastProductIdx);
    }, [categories, setLastCategoryIdx, setLastProductIdx]);

    return (
        <Paper className={classes.root}>
            <Box display="flex">
                <Box className={classes.leftSide}>
                    <DragProductList categories={categories} />
                </Box>
                <Box className={classes.rightSide}>
                    <ProductManagement />
                </Box>
            </Box>
        </Paper>
    );
};
