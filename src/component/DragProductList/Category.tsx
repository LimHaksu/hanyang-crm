import React from "react";
import { Draggable } from "react-beautiful-dnd";
import ProductList from "./product/ProductList";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import { ProductType } from "./data";

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
    })
);

interface CategoryProps {
    name: string;
    products: ProductType[];
    index: number;
}

const Category = ({ name, products, index }: CategoryProps) => {
    const classes = useStyles();

    return (
        <Draggable draggableId={name} index={index}>
            {(provided, snapshot) => (
                <Paper
                    ref={provided.innerRef}
                    className={clsx(classes.root, snapshot.isDragging && classes.isDragging)}
                    {...provided.draggableProps}
                >
                    <div className={classes.name} {...provided.dragHandleProps}>
                        {name}
                    </div>
                    <ProductList categoryName={name} products={products} />
                </Paper>
            )}
        </Draggable>
    );
};

export default Category;
