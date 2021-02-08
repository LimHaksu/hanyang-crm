import Header from "component/Header";
import { Route, Switch } from "react-router-dom";
import { preferencesTabRoutes } from "route";

export const PreferencesPage = () => {
    return (
        <>
            <Header tabRoutes={preferencesTabRoutes} subHeader />
            <Switch>
                {preferencesTabRoutes.map(({ path, component }, key) => (
                    <Route path={path} exact key={key} component={component} />
                ))}
            </Switch>
        </>
    );
};
