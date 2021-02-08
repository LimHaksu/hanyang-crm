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
    })
);

interface Product {
    idx: number;
    name: string;
    price: number;
}

const createCategory = (name: string, products: Product[]) => {
    return {
        name,
        products,
    };
};

const categories = [
    createCategory("족발", [
        { idx: 1, name: "1인족발", price: 20000 },
        { idx: 2, name: "족발小", price: 30000 },
    ]),
    createCategory("보쌈", [
        { idx: 3, name: "1인보쌈", price: 20000 },
        {
            idx: 4,
            name: "보쌈小",
            price: 30000,
        },
    ]),
    createCategory("추가메뉴", [
        { idx: 5, name: "콜라", price: 3000 },
        { idx: 6, name: "사이다", price: 3000 },
    ]),
    createCategory("할인", [
        { idx: 7, name: "내방객", price: -3000 },
        { idx: 8, name: "쿠폰", price: -2000 },
    ]),
];

interface IsOpen {
    [key: string]: boolean;
}

interface Props {
    category: ReturnType<typeof createCategory>;
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
