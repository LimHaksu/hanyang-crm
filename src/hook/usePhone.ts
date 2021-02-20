import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { addPhoneCallRecordAction } from "module/phone";
import { useCallback } from "react";

const usePhone = () => {
    const phoneCallRecords = useSelector((state: RootState) => state.phone.phoneCallRecords);
    const dispatch = useDispatch();

    const addPhoneCallRecord = useCallback(
        (
            idx: number,
            orderTime: string,
            customerName: string,
            phoneNumber: string,
            address: string,
            registerProduct: "작성" | "완료"
        ) => dispatch(addPhoneCallRecordAction(idx, orderTime, customerName, phoneNumber, address, registerProduct)),
        [dispatch]
    );

    return {
        phoneCallRecords,
        addPhoneCallRecord,
    };
};

export default usePhone;
