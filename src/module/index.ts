import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import phone from "./phone";
import order from "./order";
import product from "./product";
import customer from "./customer";
import printer from "./printer";
import { customerSaga } from "./customer/saga";
import { productSaga } from "./product/saga";
import { orderSaga } from "./order/saga";
import { phoneSaga } from "./phone/saga";

const rootReducer = combineReducers({
    phone,
    order,
    product,
    customer,
    printer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function* rootSaga() {
    yield all([customerSaga(), productSaga(), orderSaga(), phoneSaga()]);
}

export default rootReducer;
