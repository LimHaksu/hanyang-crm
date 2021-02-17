import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Product from "./Product";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Product as ProductType } from "module/product";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
        isDraggingOver: {
            backgroundColor: "#c2c2c2",
        },
        dropZone: {
            minHeight: "10px",
        },
    })
);
interface InnerQuoteListProps {
    products: ProductType[];
}

const InnerProductList = React.memo(({ products }: InnerQuoteListProps) => {
    return (
        <>
            {products.map((product, index: number) => (
                <Draggable key={product.idx} draggableId={`${product.idx}`} index={index}>
                    {(dragProvided, dragSnapshot) => (
                        <Product
                            key={product.idx}
                            product={product}
                            isDragging={dragSnapshot.isDragging}
                            provided={dragProvided}
                        />
                    )}
                </Draggable>
            ))}
        </>
    );
});

interface InnerListProps {
    products: ProductType[];
    dropProvided: any;
}

const InnerList = ({ products, dropProvided }: InnerListProps) => {
    const classes = useStyles();

    return (
        <div className={classes.dropZone} ref={dropProvided.innerRef}>
            <InnerProductList products={products} />
            {dropProvided.placeholder}
        </div>
    );
};

interface ProductListProps {
    categoryName: string;
    products: ProductType[];
}
const ProductList = ({ categoryName, products }: ProductListProps) => {
    const classes = useStyles();

    return (
        <Droppable droppableId={categoryName} type="PRODUCT">
            {(dropProvided, dropSnapshot) => (
                <Paper
                    className={dropSnapshot.isDraggingOver ? classes.isDraggingOver : ""}
                    {...dropProvided.droppableProps}
                >
                    <InnerList products={products} dropProvided={dropProvided} />
                </Paper>
            )}
        </Droppable>
    );
};

export default ProductList;
