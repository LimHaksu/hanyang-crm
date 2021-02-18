import { combineReducers } from "redux";
import phone from "./phone";
import order from "./order";
import product from "./product";
import customer from "./customer";

const rootReducer = combineReducers({
    phone,
    order,
    product,
    customer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
