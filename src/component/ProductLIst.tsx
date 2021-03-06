import { useState, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Category } from "module/product";
import useCategory from "hook/useCategory";
import useOrder from "hook/useOrder";
import { Product } from "module/product";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
        },
        tableHead: {
            "& th": {
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "default",
                padding: 10
            },
        },
        priceHead: {
            width: 60,
        },
        category: {
            fontWeight: "bold",
        },
        row: {
            userSelect: "none",
            "& > *": {
                borderBottom: "unset",
                fontSize: "1rem",
                cursor: "pointer",
                padding: 7
            },
        },
        noItems: {
            textAlign: "center",
            marginBottom: 10,
            fontSize: "1rem",
        },
    })
);

interface IsOpen {
    [key: number]: boolean;
}

interface Props {
    category: Category;
    isOpen: IsOpen;
    setIsOpen: (value: React.SetStateAction<{}>) => void;
}

const setTrueOnlyOneCategory = (isOpen: IsOpen, categoryIdx: number) => {
    const newIsOpen: IsOpen = Object.keys(isOpen).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    newIsOpen[categoryIdx] = true;
    return newIsOpen;
};

const CategoryRow = ({ category, isOpen, setIsOpen }: Props) => {
    const classes = useStyles();
    const { orderForm, addProduct, changeAmount } = useOrder();

    const handleProductClick = useCallback(
        (product: Product) => () => {
            const foundIndex = orderForm.products.findIndex((p) => p.idx === product.idx);
            if (foundIndex >= 0) {
                const prevAmount = orderForm.products[foundIndex].amount;
                changeAmount(foundIndex, prevAmount + 1);
            } else {
                addProduct({ ...product, amount: 1 });
            }
        },
        [addProduct, changeAmount, orderForm]
    );

    return (
        <>
            <TableRow className={classes.row} hover>
                <TableCell
                    className={classes.category}
                    onClick={() => {
                        const newIsOpen = setTrueOnlyOneCategory(isOpen, category.idx);
                        setIsOpen(newIsOpen);
                    }}
                    colSpan={2}
                >
                    {category.name}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={isOpen[category.idx]} timeout="auto" unmountOnExit>
                        <Table aria-label="procuct">
                            <TableBody>
                                {category.products.map((product) => (
                                    <TableRow
                                        className={classes.row}
                                        key={product.idx}
                                        hover
                                        onClick={handleProductClick(product)}
                                    >
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="right">{product.price.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {category.products.length === 0 && (
                                    <TableRow>
                                        <TableCell className={classes.noItems}>등록된 상품이 없습니다</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const ProductList = () => {
    const classes = useStyles();
    const { categories } = useCategory();
    const [isOpen, setIsOpen] = useState<IsOpen>(
        categories.reduce((acc, category) => ({ ...acc, [category.idx]: false }), {})
    );

    return (
        <TableContainer component={Paper} className={classes.root}>
            <Table stickyHeader aria-label="collapsible table">
                <TableHead className={classes.tableHead}>
                    <TableRow>
                        <TableCell>상품명</TableCell>
                        <TableCell className={classes.priceHead}>가격</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {categories.map((category) => (
                        <CategoryRow key={category.idx} category={category} isOpen={isOpen} setIsOpen={setIsOpen} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductList;
