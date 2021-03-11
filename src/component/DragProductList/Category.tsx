import React, { useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ProductList from "./product/ProductList";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Modal from "component/Modal";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { Product } from "module/product";
import useCategory from "hook/useCategory";
import useCategoryForm from "hook/useCategoryForm";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#eee",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
        },
        name: {
            fontWeight: "bold",
            fontSize: "1.1rem",
            padding: "5px",
            borderBottom: "1px solid #ddd",
        },
        textVerticalCenter: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        },
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
        centerAlign: {
            textAlign: "center",
        },
        rightAlign: {
            textAlign: "right",
        },
        hover: {
            "&:hover": {
                cursor: "pointer",
                "& svg": {
                    color: "#ff0055",
                },
            },
        },
        modalMessage: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            lineHeight: "2rem",
            marginBottom: "10px",
        },
    })
);

interface CategoryProps {
    categoryIdx: number;
    name: string;
    lexoRank: string;
    products: Product[];
    index: number;
}

const Category = ({ categoryIdx, name, lexoRank, products, index }: CategoryProps) => {
    const classes = useStyles();
    const { removeCategory } = useCategory();
    const { setCategoryForm, setCategoryEditMode } = useCategoryForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

    const [clickedCategory, setClickedCategory] = useState({ name: "", idx: -1 });

    const handleEditClick = useCallback(
        (e) => {
            setCategoryForm(categoryIdx, name, lexoRank);
            setCategoryEditMode(true);
        },
        [setCategoryForm, categoryIdx, name, lexoRank, setCategoryEditMode]
    );

    const handleDeleteClick = useCallback(
        (e) => {
            setClickedCategory({ idx: categoryIdx, name });
            setIsModalOpen(true);
        },
        [categoryIdx, name]
    );

    const handleDeleteOkClick = useCallback(() => {
        if (products.length > 0) {
            setIsModalOpen(false);
            setIsErrorModalOpen(true);
            return;
        }
        removeCategory(clickedCategory.idx);
        setCategoryForm(-1, "", "");
        setCategoryEditMode(false);
    }, [products.length, removeCategory, clickedCategory.idx, setCategoryForm, setCategoryEditMode]);

    const handleDeleteCancelClick = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleErrorOkClick = useCallback(() => {
        setIsErrorModalOpen(false);
    }, []);

    return (
        <Draggable draggableId={`category-${categoryIdx}`} index={index}>
            {(provided, snapshot) => (
                <>
                    <Paper
                        ref={provided.innerRef}
                        className={clsx(classes.root, snapshot.isDragging && classes.isDragging)}
                        {...provided.draggableProps}
                    >
                        <Grid container spacing={1} className={clsx(classes.name)} {...provided.dragHandleProps}>
                            <Grid item xs={9} className={classes.textVerticalCenter}>
                                {name}
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid
                                item
                                xs={1}
                                className={clsx(classes.centerAlign, classes.hover)}
                                onClick={handleEditClick}
                            >
                                <Edit />
                            </Grid>
                            <Grid
                                item
                                xs={1}
                                className={clsx(classes.centerAlign, classes.hover)}
                                onClick={handleDeleteClick}
                            >
                                <Delete />
                            </Grid>
                        </Grid>
                        <ProductList categoryName={name} products={products} />
                    </Paper>
                    <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                        <Box display="flex" flexDirection="column">
                            <div className={classes.modalMessage}>
                                [카테고리명 : {clickedCategory.name}]<br />
                                정말로 삭제하시겠습니까?
                            </div>
                            <Box display="flex" justifyContent="space-around">
                                <Button variant="outlined" color="primary" onClick={handleDeleteOkClick}>
                                    예
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleDeleteCancelClick}>
                                    아니오
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                    <Modal open={isErrorModalOpen} setOpen={setIsErrorModalOpen}>
                        <Box display="flex" flexDirection="column">
                            <div className={classes.modalMessage}>
                                카테고리에 상품이 있으면 카테고리를 삭제할 수 없습니다.
                                <br />
                                카테고리를 비워주세요.
                            </div>
                            <Box display="flex" justifyContent="space-around">
                                <Button variant="outlined" color="primary" onClick={handleErrorOkClick}>
                                    확인
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </>
            )}
        </Draggable>
    );
};

export default Category;
