import React, { useState, useCallback, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import LabelIcon from "@material-ui/icons/Label";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import useProduct from "hook/useProduct";
import { StyledTextField } from "./index";

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
    const [categoryName, setCategoryName] = useState("");
    const { addCategory } = useProduct();

    const handleAddCategoryClick = useCallback(() => {
        addCategory(100, categoryName, "f");
        setCategoryName("");
    }, [addCategory, categoryName]);

    const handleCancelCategoryClick = useCallback(() => {
        setCategoryName("");
    }, []);

    const onCategoryNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    }, []);

    return (
        <Paper className={classes.category}>
            <div className={classes.title}>카테고리</div>
            <Box className={classes.box}>
                <StyledTextField
                    label="이름"
                    icon={<LabelIcon />}
                    className={classes.textField}
                    value={categoryName}
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
                            disabled={!categoryName}
                        >
                            추가
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
