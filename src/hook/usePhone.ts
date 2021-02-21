import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../module";
import { addPhoneCallRecordAction, setRegiteredPhoneDevicesAction } from "module/phone";
import { useCallback } from "react";
import { Device } from "node-hid";

const usePhone = () => {
    const registeredPhoneDevices = useSelector((state: RootState) => state.phone.registeredPhoneDevices);
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

    const setRegisteredPhoneDevices = useCallback(
        (selectedDevices: Device[]) => dispatch(setRegiteredPhoneDevicesAction(selectedDevices)),
        [dispatch]
    );

    return {
        registeredPhoneDevices,
        phoneCallRecords,
        setRegisteredPhoneDevices,
        addPhoneCallRecord,
    };
};

export default usePhone;
