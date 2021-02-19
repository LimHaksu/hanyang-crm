import { useEffect } from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
import { tabRoutes } from "route";
import { ThemeProvider } from "@material-ui/core/styles";
import Header from "component/Header";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import koLocale from "date-fns/locale/ko";
import { defaultTheme } from "theme";
import useCategory from "./hook/useCategory";

const App = () => {
    const { getCategories } = useCategory();

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return (
        <HashRouter>
            <ThemeProvider theme={defaultTheme}>
                <Header tabRoutes={tabRoutes} />
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
                    <Switch>
                        {tabRoutes.map(({ path, component }, key) => (
                            <Route path={path} exact={path !== "/preferences"} key={key} component={component} />
                        ))}
                    </Switch>
                </MuiPickersUtilsProvider>
            </ThemeProvider>
        </HashRouter>
    );
};

export default App;
