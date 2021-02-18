import { useState, useCallback } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles, createStyles, Theme, fade } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Box from "@material-ui/core/Box";
import useCustomer from "hook/useCustomer";
import { SearchBy } from "module/customer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            padding: 10,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        search: {
            position: "relative",
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            "&:hover": {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            marginBottom: 10,
            width: "100%",
            border: "1px solid #aaa",
        },
        searchIcon: {
            color: "inherit",
            padding: 10,
            cursor: "pointer",
            "&:hover": {
                color: theme.palette.secondary.main,
            },
        },
        inputRoot: {
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `1rem`,
            transition: theme.transitions.create("width"),
            width: "100%",
            boxSizing: "border-box",
        },
    })
);

interface SelectBoxProps {
    value: string;
    onChange?: (
        event: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
        }>,
        child: React.ReactNode
    ) => void;
}

const SelectBox = ({ value, onChange }: SelectBoxProps) => {
    const classes = useStyles();

    return (
        <>
            <FormControl className={classes.formControl}>
                <Select value={value} onChange={onChange}>
                    <MenuItem value="name">이름</MenuItem>
                    <MenuItem value="phoneNumber">전화</MenuItem>
                    <MenuItem value="address">주소</MenuItem>
                </Select>
            </FormControl>
        </>
    );
};

interface SearchProp {
    searchBy: SearchBy;
}

const Search = ({ searchBy }: SearchProp) => {
    const classes = useStyles();
    const [keyword, setKeyword] = useState("");
    const { searchCustomer } = useCustomer();

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }, []);

    const handleSubmit = useCallback(() => {
        searchCustomer(searchBy, keyword);
    }, [searchCustomer, searchBy, keyword]);

    const handleEnter = useCallback(
        (e) => {
            if (e.key === "Enter") {
                handleSubmit();
            }
        },
        [handleSubmit]
    );

    return (
        <Box className={classes.search} display="flex">
            <InputBase
                placeholder="검색..."
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={handleInputChange}
                onKeyUp={handleEnter}
                value={keyword}
            />
            <div className={classes.searchIcon} onClick={handleSubmit}>
                <SearchIcon />
            </div>
        </Box>
    );
};

const CustomerSearch = () => {
    const classes = useStyles();
    const [searchBy, setSearchBy] = useState<SearchBy>("name");

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSearchBy(event.target.value as SearchBy);
    };

    return (
        <Paper>
            <div className={classes.title}>고객 검색</div>
            <Box display="flex">
                <SelectBox value={searchBy} onChange={handleChange} />
                <Search searchBy={searchBy} />
            </Box>
        </Paper>
    );
};

export default CustomerSearch;
