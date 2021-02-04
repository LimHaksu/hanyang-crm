import { Route, HashRouter, Switch } from "react-router-dom";
import { tabRoutes } from "route";
import Header from "component/header/Header";

const App = () => {
    return (
        <HashRouter>
            <Header />
            <Switch>
                {tabRoutes.map(({ path, component }, key) => {
                    return <Route path={path} exact key={key} component={component} />;
                })}
            </Switch>
        </HashRouter>
    );
};

export default App;
