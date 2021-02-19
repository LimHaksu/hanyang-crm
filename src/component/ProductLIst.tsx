import { useState } from "react";
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

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            height: "calc(100vh - 64px)",
        },
        tableHead: {
            "& th": {
                fontWeight: "bold",
                fontSize: "1.2rem",
                cursor: "default",
            },
        },
        priceHead: {
            width: 60,
        },
        category: {
            fontWeight: "bold",
        },
        row: {
            "& > *": {
                borderBottom: "unset",
                fontSize: "1.1rem",
                cursor: "pointer",
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
    [key: string]: boolean;
}

interface Props {
    category: Category;
    isOpen: IsOpen;
    setIsOpen: (value: React.SetStateAction<{}>) => void;
}

const setTrueOnlyOneCategory = (isOpen: IsOpen, categoryName: string) => {
    const newIsOpen: IsOpen = Object.keys(isOpen).reduce((acc, key) => ({ ...acc, [key]: false }), {});
    newIsOpen[categoryName] = true;
    return newIsOpen;
};

const CategoryRow = ({ category, isOpen, setIsOpen }: Props) => {
    const classes = useStyles();

    return (
        <>
            <TableRow className={classes.row} hover>
                <TableCell
                    className={classes.category}
                    onClick={() => {
                        const newIsOpen = setTrueOnlyOneCategory(isOpen, category.name);
                        setIsOpen(newIsOpen);
                    }}
                    colSpan={2}
                >
                    {category.name}
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={isOpen[category.name]} timeout="auto" unmountOnExit>
                        <Table aria-label="procuct">
                            <TableBody>
                                {category.products.map((product) => (
                                    <TableRow className={classes.row} key={product.idx} hover>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="right">{product.price.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                                {category.products.length === 0 && (
                                    <div className={classes.noItems}>등록된 상품이 없습니다</div>
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
        categories.reduce((acc, category) => ({ ...acc, [category.name]: false }), {})
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
                        <CategoryRow key={category.name} category={category} isOpen={isOpen} setIsOpen={setIsOpen} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ProductList;
