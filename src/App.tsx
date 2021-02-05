//@ts-nocheck
import { Route, HashRouter, Switch } from "react-router-dom";
import { tabRoutes } from "route";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Header from "component/header/Header";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import koLocale from "date-fns/locale/ko";

const MAIN_COLOR = "#298d63";
const defaultTheme = createMuiTheme({
    palette: {
        primary: {
            main: MAIN_COLOR,
        },
    },
    overrides: {
        MuiPickersToolbar: {
            toolbar: {
                backgroundColor: MAIN_COLOR,
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
