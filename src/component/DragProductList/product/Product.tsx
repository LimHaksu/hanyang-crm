import { useCallback, useState } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Modal from "component/Modal";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import clsx from "clsx";
import { Product as ProductType } from "module/product";
import useProduct from "hook/useProduct";

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

interface ProductProps {
    product: ProductType;
    isDragging: boolean;
    provided: DraggableProvided;
}

//
const Product = ({ product, isDragging, provided }: ProductProps) => {
    const classes = useStyles();
    const { removeProduct, setProductForm, setProductEditMode } = useProduct();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clickedProduct, setClickedProduct] = useState({ name: "", idx: -1 });

    const handleEditClick = useCallback(
        (e) => {
            const { idx, categoryidx, name, price } = e.currentTarget.dataset;
            setProductForm(idx, categoryidx, name, price);
            setProductEditMode(true);
        },
        [setProductForm, setProductEditMode]
    );

    const handleDeleteClick = useCallback((e) => {
        const { idx, name } = e.currentTarget.dataset;
        setClickedProduct({ idx: +idx, name });
        setIsModalOpen(true);
    }, []);

    const handleDeleteOkClick = useCallback(() => {
        removeProduct(clickedProduct.idx);
    }, [removeProduct, clickedProduct]);

    const handleDeleteCancelClick = useCallback(() => {
        setIsModalOpen(false);
    }, []);
    return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Paper className={clsx(classes.root, isDragging && classes.isDragging)}>
                <Grid container spacing={1}>
                    <Grid item xs={7} className={classes.centerAlign}>
                        {product.name}
                    </Grid>
                    <Grid item xs={2} className={classes.rightAlign}>
                        {product.price.toLocaleString()}
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid
                        item
                        xs={1}
                        className={clsx(classes.rightAlign, classes.hover)}
                        data-idx={product.idx}
                        data-categoryidx={product.categoryIdx}
                        data-name={product.name}
                        data-price={product.price}
                        onClick={handleEditClick}
                    >
                        <Edit />
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        className={clsx(classes.rightAlign, classes.hover)}
                        data-idx={product.idx}
                        data-name={product.name}
                        onClick={handleDeleteClick}
                    >
                        <Delete />
                    </Grid>
                </Grid>
            </Paper>
            <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>
                        [상품명 : {clickedProduct.name}]<br />
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
        </div>
    );
};

export default Product;
