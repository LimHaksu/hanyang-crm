import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import phone from "./phone";
import order from "./order";
import product from "./product";
import customer from "./customer";
import { customerSaga } from "./customer/saga";
import { productSaga } from "./product/saga";

const rootReducer = combineReducers({
    phone,
    order,
    product,
    customer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
    yield all([customerSaga(), productSaga()]);
}

export default rootReducer;
