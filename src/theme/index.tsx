//@ts-nocheck
import { createMuiTheme } from "@material-ui/core/styles";

export const PRIMARY_MAIN_COLOR = "#298d63";
export const PRIMARY_LIGHT_COLOR = "#39b481";
export const SECONDARY_MAIN_COLOR = "#9ee9af";
export const SECONDARY_DARK_COLOR = "#88c997";

export const defaultTheme = createMuiTheme({
    palette: {
        primary: {
            main: PRIMARY_MAIN_COLOR,
            light: PRIMARY_LIGHT_COLOR,
        },
        secondary: {
            main: SECONDARY_MAIN_COLOR,
            dark: SECONDARY_DARK_COLOR,
        },
    },
    overrides: {
        MuiTableRow: {
            hover: {
                "&:hover": {
                    "& td": {
                        fontWeight: "bold",
                        backgroundColor: "inherit",
                    },
                },
            },
        },
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: PRIMARY_MAIN_COLOR,
            },
        },
        MuiSvgIcon: {
            root: {
                color: PRIMARY_MAIN_COLOR,
            },
        },
    },
});
