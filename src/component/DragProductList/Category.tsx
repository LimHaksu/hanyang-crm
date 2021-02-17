import React, { useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ProductList from "./product/ProductList";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Modal from "component/Modal";
import clsx from "clsx";
import { Product } from "module/product";
import useProduct from "hook/useProduct";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

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
            fontSize: "1.4rem",
            padding: "15px",
            borderBottom: "1px solid #ddd",
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
    name: string;
    products: Product[];
    index: number;
}

const Category = ({ name, products, index }: CategoryProps) => {
    const classes = useStyles();
    const { removeCategory, setCategoryForm, setCategoryEditMode } = useProduct();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedCategory, setClickedCategory] = useState({ name: "", idx: -1 });

    const handleEditClick = useCallback(
        (e) => {
            const { idx, name } = e.currentTarget.dataset;
            setCategoryForm(+idx, name);
            setCategoryEditMode(true);
        },
        [setCategoryForm, setCategoryEditMode]
    );

    const handleDeleteClick = useCallback((e) => {
        const { idx, name } = e.currentTarget.dataset;
        setClickedCategory({ idx: +idx, name });
        setIsModalOpen(true);
    }, []);

    const handleDeleteOkClick = useCallback(() => {
        removeCategory(clickedCategory.idx);
    }, [removeCategory, clickedCategory]);

    const handleDeleteCancelClick = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <Draggable draggableId={name} index={index}>
            {(provided, snapshot) => (
                <>
                    <Paper
                        ref={provided.innerRef}
                        className={clsx(classes.root, snapshot.isDragging && classes.isDragging)}
                        {...provided.draggableProps}
                    >
                        <Grid container className={classes.name} {...provided.dragHandleProps}>
                            <Grid item xs={9}>
                                {name}
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid
                                item
                                xs={1}
                                className={clsx(classes.rightAlign, classes.hover)}
                                data-idx={index}
                                data-name={name}
                                onClick={handleEditClick}
                            >
                                <Edit />
                            </Grid>
                            <Grid
                                item
                                xs={1}
                                className={clsx(classes.rightAlign, classes.hover)}
                                data-idx={index}
                                data-name={name}
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
                </>
            )}
        </Draggable>
    );
};

export default Category;
