import { combineReducers } from "redux";
import phone from "./phone";
import order from "./order";
import product from "./product";

const rootReducer = combineReducers({
    phone,
    order,
    product,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
