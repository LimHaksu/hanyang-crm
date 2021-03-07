import Header from "component/Header";
import { Route, Switch } from "react-router-dom";
import { statisticsTabRoutes } from "route";

export const StatisticsPage = () => {
    return (
        <>
            <Header tabRoutes={statisticsTabRoutes} subHeader />
            <Switch>
                {statisticsTabRoutes.map(({ path, component }, key) => (
                    <Route path={path} exact key={key} component={component} />
                ))}
            </Switch>
        </>
    );
};
