//@ts-nocheck
import { Route, HashRouter, Switch } from "react-router-dom";
import { tabRoutes } from "route";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "component/header/Header";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import koLocale from "date-fns/locale/ko";

const PRIMARY_MAIN_COLOR = "#298d63";
const PRIMARY_LIGHT_COLOR = "#39b481";
const defaultTheme = createMuiTheme({
    palette: {
        primary: {
            main: PRIMARY_MAIN_COLOR,
            light: PRIMARY_LIGHT_COLOR,
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
    },
});

const App = () => {
    return (
        <HashRouter>
            <ThemeProvider theme={defaultTheme}>
                <Header />
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
                    <Switch>
                        {tabRoutes.map(({ path, component }, key) => {
                            return <Route path={path} exact key={key} component={component} />;
                        })}
                    </Switch>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </HashRouter>
    );
};

export default App;
