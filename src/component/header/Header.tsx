import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import { tabRoutes } from "route";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    toolbar: {
        backgroundColor: "#1976D2",
    },
    link: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: "1.1rem",
        lineHeight: "1.4rem",
        textDecoration: "none",
        padding: theme.spacing(2),
        margin: "0 5px",
        borderRadius: "15px",
        "&:hover": {
            textDecoration: "none",
            boxShadow: "1px 1px 3px 1px #000 inset",
        },
    },
    emphasis: {
        backgroundColor: "#fff",
        color: "#1976D2",
        textDecoration: "none",
    },
}));

export default function ProminentAppBar() {
    const { pathname } = useLocation();
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                {tabRoutes.map(({ name, path }, idx) => (
                    <Link
                        className={`${classes.link} ${pathname === path ? classes.emphasis : ""}`}
                        href={`#${path}`}
                        key={idx}
                    >
                        {name}
                    </Link>
                ))}
            </Toolbar>
        </AppBar>
    );
}
