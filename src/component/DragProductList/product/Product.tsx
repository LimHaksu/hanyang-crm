import { DraggableProvided } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { ProductType } from "../data";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: "15px 15px 15px 25px",
            fontSize: "1.2rem",
            borderBottom: "1px solid #ddd",
        },
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
        rightAlign: {
            textAlign: "right",
        },
    })
);

interface ProductProps {
    product: ProductType;
    isDragging: boolean;
    provided: DraggableProvided;
}

//
const Product = ({ product, isDragging, provided }: ProductProps) => {
    const classes = useStyles();

    return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Paper className={clsx(classes.root, isDragging && classes.isDragging)}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        {product.name}
                    </Grid>
                    <Grid item xs={3} className={classes.rightAlign}>
                        {product.price.toLocaleString()}
                    </Grid>
                    <Grid item xs={1}></Grid>
                </Grid>
            </Paper>
        </div>
    );
};

export default Product;
