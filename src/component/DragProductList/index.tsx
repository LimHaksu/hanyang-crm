import React, { useState, useCallback } from "react";
import Category from "./Category";
import reorder, { reorderCategories } from "./reorder";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { CategoryType } from "./data";

const useStyles = makeStyles((theme: Theme) =>
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
            backgroundColor: "#dbdbdb",
            "& *": {
                fontSize: "1.2rem",
                fontWeight: "bold",
                padding: "16px",
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
    })
);

interface DragProductListProps {
    initial: CategoryType[];
}

const getCategoryByIdx = (categories: CategoryType[], categoryIdx: number) => {
    return categories.find((category) => category.idx === categoryIdx);
};

const DragProductList = ({ initial }: DragProductListProps) => {
    const classes = useStyles();
    const [categories, setCategories] = useState(initial);
    const [ordered, setOrdered] = useState(initial.map((category) => category.idx));

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const source = result.source;
            const destination = result.destination;

            if (destination) {
                // did not move anywhere - can bail early
                if (source.droppableId === destination.droppableId && source.index === destination.index) {
                    return;
                }

                // reordering column
                if (result.type === "CATEGORY") {
                    const newOrdered = reorder(ordered, source.index, destination.index);
                    setOrdered(newOrdered);
                    return;
                }

                const newCategories = reorderCategories({
                    categories: categories,
                    source,
                    destination,
                });
                setCategories(newCategories);
            }
        },
        [categories, ordered]
    );

    const board = (
        <Droppable droppableId="category" type="CATEGORY">
            {(provided) => (
                <div className={classes.container} ref={provided.innerRef} {...provided.droppableProps}>
                    {ordered.map((categoryIdx, index) => {
                        const category = getCategoryByIdx(categories, categoryIdx)!;
                        return (
                            <Category
                                key={categoryIdx}
                                index={index}
                                name={category.name}
                                products={category.products}
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
                <Grid item xs={9} className={classes.alignCenter}>
                    상품명
                </Grid>
                <Grid item xs={3}>
                    가격
                </Grid>
            </Grid>
            <DragDropContext onDragEnd={onDragEnd}>{board}</DragDropContext>
        </Paper>
    );
};

export default DragProductList;
