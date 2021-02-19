import React, { useCallback } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LabelIcon from "@material-ui/icons/Label";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { StyledTextField } from "./index";
import useCategoryForm from "hook/useCategoryForm";
import useCategory from "hook/useCategory";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        category: {
            padding: 15,
            marginBottom: 10,
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
    })
);

const CategoryForm = () => {
    const classes = useStyles();
    const { addCategory, editCategory } = useCategory();
    const { categoryForm, setCategoryForm, isCategoryEditMode, setCategoryEditMode } = useCategoryForm();

    const handleAddCategoryClick = useCallback(() => {
        if (isCategoryEditMode) {
            editCategory(categoryForm.idx, categoryForm.name, categoryForm.lexoRank);
        } else {
            addCategory(categoryForm.name);
        }
        setCategoryForm(categoryForm.idx, "", "");
        setCategoryEditMode(false);
    }, [addCategory, editCategory, setCategoryForm, categoryForm, setCategoryEditMode, isCategoryEditMode]);

    const handleCancelCategoryClick = useCallback(() => {
        setCategoryForm(-1, "", "");
        setCategoryEditMode(false);
    }, [setCategoryForm, setCategoryEditMode]);

    const onCategoryNameChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setCategoryForm(categoryForm.idx, e.target.value, categoryForm.lexoRank);
        },
        [setCategoryForm, categoryForm.idx, categoryForm.lexoRank]
    );

    return (
        <Paper className={classes.category}>
            <div className={classes.title}>카테고리</div>
            <Box className={classes.box}>
                <StyledTextField
                    label="이름"
                    icon={<LabelIcon />}
                    className={classes.textField}
                    value={categoryForm.name}
                    onChange={onCategoryNameChange}
                />
                <Box display="flex">
                    <Box flexGrow={1}></Box>
                    <Box>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={handleAddCategoryClick}
                            disabled={!categoryForm.name}
                        >
                            {isCategoryEditMode ? "수정" : "추가"}
                        </Button>
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            onClick={handleCancelCategoryClick}
                        >
                            취소
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default React.memo(CategoryForm);
