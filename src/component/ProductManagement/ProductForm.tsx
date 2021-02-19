import React, { useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import LabelIcon from "@material-ui/icons/Label";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import Money from "@material-ui/icons/Money";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { StyledTextField } from "./index";
import useCategory from "hook/useCategory";
import useProduct from "hook/useProduct";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            margin: "10px 0 0 10px",
        },
        box: {
            maxWidth: "fit-content",
        },
        formControl: {
            minWidth: 120,
        },
        readOnly: {
            "& .MuiSelect-select": {
                cursor: "not-allowed",
                backgroundColor: "#eee",
            },
        },
    })
);

interface StyleSelectProp {
    label: string;
    icon?: React.ReactElement;
    className?: string;
    value?: string;
    children?: React.ReactNode;
    onChange?:
        | ((
              event: React.ChangeEvent<{
                  name?: string | undefined;
                  value: unknown;
              }>,
              child: React.ReactNode
          ) => void)
        | undefined;
    readOnly?: boolean;
}

const StyledSelect = ({ label, icon, className, value, children, onChange, readOnly }: StyleSelectProp) => {
    const classes = useStyles();
    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">카테고리</InputLabel>
                    <Select label={label} className={className} value={value} onChange={onChange} readOnly={readOnly}>
                        {children}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

const ProductForm = () => {
    const classes = useStyles();
    const { categories } = useCategory();
    const {
        productForm,
        setProductForm,
        addProduct,
        editProduct,
        isProductEditMode,
        setProductEditMode,
    } = useProduct();

    const resetProductForm = useCallback(() => {
        setProductForm(-1, "", "", "");
        setProductEditMode(false);
    }, [setProductForm, setProductEditMode]);

    const handleAddProductClick = useCallback(() => {
        const { idx, categoryIdx, name, price } = productForm;
        if (isProductEditMode) {
            editProduct(+idx, +categoryIdx, name, +price);
        } else {
            addProduct(name, +price, +productForm.categoryIdx);
        }
        resetProductForm();
    }, [addProduct, editProduct, productForm, resetProductForm, isProductEditMode]);

    const handleCancelProductClick = useCallback(() => {
        resetProductForm();
    }, [resetProductForm]);

    const handleCategoryNameChange = useCallback(
        (e) => {
            setProductForm(productForm.idx, e.target.value, productForm.name, productForm.price);
        },
        [setProductForm, productForm.idx, productForm.name, productForm.price]
    );

    const handleProductNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProductForm(productForm.idx, productForm.categoryIdx, e.target.value, productForm.price);
        },
        [setProductForm, productForm.idx, productForm.categoryIdx, productForm.price]
    );

    const handleProductPriceChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProductForm(
                productForm.idx,
                productForm.categoryIdx,
                productForm.name,
                e.target.value.replace(/,/g, "")
            );
        },
        [setProductForm, productForm.idx, productForm.categoryIdx, productForm.name]
    );

    const getPriceLocale = useCallback((price: string) => {
        if (price === "") {
            return "";
        }
        const regex = /^[-]?[0-9]*$/;
        if (regex.test(price)) {
            if (price === "-") {
                return price;
            }
            return (+price).toLocaleString();
        } else {
            const newPrice = price.substring(0, price.length - 1);
            if (newPrice.length > 2) {
                return (+newPrice).toLocaleString();
            }
            return newPrice;
        }
    }, []);

    const validate = useCallback(
        () => productForm.categoryIdx && productForm.name && getPriceLocale(productForm.price),
        [productForm.categoryIdx, productForm.name, productForm.price, getPriceLocale]
    );

    return (
        <Paper className={classes.product}>
            <div className={classes.title}>상품</div>
            <Box className={classes.box}>
                <StyledSelect
                    className={isProductEditMode ? classes.readOnly : ""}
                    label="카테고리"
                    icon={<LabelIcon />}
                    onChange={handleCategoryNameChange}
                    value={isProductEditMode ? productForm.categoryIdx : productForm.categoryIdx}
                    readOnly={isProductEditMode}
                >
                    {categories.map((category, idx) => (
                        <MenuItem key={idx} value={category.idx}>
                            {category.name}
                        </MenuItem>
                    ))}
                </StyledSelect>
                <StyledTextField
                    label="이름"
                    icon={<RestaurantMenuIcon />}
                    className={classes.textField}
                    value={productForm.name}
                    onChange={handleProductNameChange}
                />
                <StyledTextField
                    label="가격"
                    icon={<Money />}
                    value={getPriceLocale(productForm.price)}
                    onChange={handleProductPriceChange}
                />
                <Box display="flex">
                    <Box flexGrow={1}></Box>
                    <Box>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={handleAddProductClick}
                            disabled={!validate()}
                        >
                            {isProductEditMode ? "수정" : "추가"}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            onClick={handleCancelProductClick}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default React.memo(ProductForm);
