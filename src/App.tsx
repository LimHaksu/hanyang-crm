import { Route, HashRouter, Switch } from "react-router-dom";
import { tabRoutes } from "route";
import { ThemeProvider } from "@material-ui/core/styles";
import Header from "component/Header";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import koLocale from "date-fns/locale/ko";
import { defaultTheme } from "theme";
import InitializeApp from "./component/InitializeApp";

const App = () => {
    return (
        <>
            <InitializeApp />
            <HashRouter>
                <ThemeProvider theme={defaultTheme}>
                    <Header tabRoutes={tabRoutes} />
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
                        <Switch>
                            {tabRoutes.map(({ path, component }, key) => {
                                let exact = true;
                                switch (path) {
                                    case "/preferences":
                                    case "/statistics":
                                        exact = false;
                                        break;
                                    default:
                                        break;
                                }
                                return <Route path={path} exact={exact} key={key} component={component} />;
                            })}
                        </Switch>
                    </MuiPickersUtilsProvider>
                </ThemeProvider>
            </HashRouter>
        </>
    );
};

export default App;
