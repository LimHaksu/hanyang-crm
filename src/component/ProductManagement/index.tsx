import { useState, useCallback, useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CategoryForm from "./CategoryForm";
import ProductForm from "./ProductForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            backgroundColor: theme.palette.primary.light,
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

export const StyledTextField = ({ label, icon, className, value, onChange }: StyledTextFieldProp) => {
    return (
        <Grid container spacing={1} alignItems="flex-end">
            <Grid item>{icon}</Grid>
            <Grid item>
                <TextField label={label} className={className} value={value} onChange={onChange} />
            </Grid>
        </Grid>
    );
};

const ProductManagement = () => {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <CategoryForm />
            <ProductForm />
        </Paper>
    );
};

export default ProductManagement;
