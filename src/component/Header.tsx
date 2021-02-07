import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { tabRoutes } from "route";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
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
        userSelect: "none",
    },
    emphasis: {
        backgroundColor: "#fff",
        color: theme.palette.primary.main,
        textDecoration: "none",
    },
}));

export default function ProminentAppBar() {
    const { pathname } = useLocation();
    const classes = useStyles();
    return (
        <AppBar position="static">
            <Toolbar>
                {tabRoutes.map(({ name, path }, idx) => (
                    <Link
                        className={clsx(classes.link, pathname === path && classes.emphasis)}
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
