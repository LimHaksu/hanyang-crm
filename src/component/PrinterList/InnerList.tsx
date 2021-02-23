import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Printer } from "util/printer";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 20,
        height: "calc(100vh - 168px)",
    },
    list: {
        width: "100%",
        maxHeight: "calc(100vh - 257px)",
        overflowY: "auto",
        backgroundColor: theme.palette.background.paper,
    },
    serchButton: {
        paddingBottom: 20,
    },
    notice: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: 20,
    },
    dn: {
        display: "none",
    },
}));

interface InnerListProps {
    printers: Printer[];
    onItemClick: (idx: number) => () => void;
    selectedPrinter: string;
}

const InnerList = ({ printers, onItemClick, selectedPrinter }: InnerListProps) => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            {printers.map((printer, idx) => (
                <ListItem key={idx} button onClick={onItemClick(idx)}>
                    <ListItemIcon>
                        <Checkbox value={printer.name} checked={printer.name === selectedPrinter} />
                    </ListItemIcon>
                    {printer.name}
                </ListItem>
            ))}
        </List>
    );
};

export default React.memo(InnerList);
