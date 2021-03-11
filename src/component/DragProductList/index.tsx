import React, { useCallback } from "react";
import Category from "./Category";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import useCategory from "hook/useCategory";
import useProduct from "hook/useProduct";
import useCategoryForm from "hook/useCategoryForm";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
            overflow: "auto",
            userSelect: "none",
        },
        head: {
            position: "sticky",
            top: 0,
            backgroundColor: "#f7f7f7",
            "& *": {
                fontSize: "1rem",
                fontWeight: "bold",
                padding: "10px",
                borderBottom: "1px solid #ddd",
            },
            userSelect: "none",
        },
        container: {
            display: "inline-flex",
            flexDirection: "column",
            width: "100%",
        },
        alignCenter: {
            textAlign: "center",
        },
        alignRight: {
            textAlign: "right",
        },
    })
);

const DragProductList = () => {
    const classes = useStyles();
    const { categories, moveCategory } = useCategory();
    const { moveProduct, setProductForm, setProductEditMode } = useProduct();
    const { setCategoryForm, setCategoryEditMode } = useCategoryForm();

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const source = result.source;
            const destination = result.destination;

            if (destination) {
                // did not move anywhere - can bail early
                if (source.droppableId === destination.droppableId && source.index === destination.index) {
                    return;
                }

                // 카테고리 옮기기
                if (result.type === "CATEGORY") {
                    setCategoryForm(-1, "", "");
                    setCategoryEditMode(false);
                    moveCategory(source.index, destination.index);
                    return;
                }

                // 상품 옮기기
                const currentIdx = categories.findIndex((category) => category.name === source.droppableId);
                const nextIdx = categories.findIndex((category) => category.name === destination.droppableId);
                setProductForm(-1, "", "", "", "");
                setProductEditMode(false);
                moveProduct(currentIdx, nextIdx, source.index, destination.index);
            }
        },
        [
            categories,
            moveCategory,
            moveProduct,
            setCategoryForm,
            setProductForm,
            setCategoryEditMode,
            setProductEditMode,
        ]
    );
    const board = (
        <Droppable droppableId="category" type="CATEGORY">
            {(provided) => (
                <div className={classes.container} ref={provided.innerRef} {...provided.droppableProps}>
                    {categories.map((category, index) => {
                        return (
                            <Category
                                key={category.idx}
                                categoryIdx={category.idx}
                                index={index}
                                name={category.name}
                                lexoRank={category.lexoRank}
                                products={category.products.map((product) => ({
                                    ...product,
                                    categoryIdx: category.idx,
                                }))}
                            />
                        );
                    })}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );

    return (
        <Paper className={classes.root}>
            <Grid container className={classes.head}>
                <Grid item xs={7} className={classes.alignCenter}>
                    상품명
                </Grid>
                <Grid item xs={2} className={classes.alignRight}>
                    가격
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={1}>
                    수정
                </Grid>
                <Grid item xs={1}>
                    삭제
                </Grid>
            </Grid>
            <DragDropContext onDragEnd={onDragEnd}>{board}</DragDropContext>
        </Paper>
    );
};

export default React.memo(DragProductList);
