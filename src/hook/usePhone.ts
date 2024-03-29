import { useCallback } from "react";
import { Device } from "node-hid";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "module/index";
import { setIsPhoneCallRecordAscAction, setRegiteredPhoneDevicesAction, setSelectedDateAction } from "module/phone";
import { getPhoneCallRecordsAsync, addPhoneCallRecordAsync, removePhoneCallRecordAsync } from "module/phone/saga";

const usePhone = () => {
    const registeredPhoneDevices = useSelector((state: RootState) => state.phone.registeredPhoneDevices);
    const phoneCallRecords = useSelector((state: RootState) => state.phone.phoneCallRecords);
    const selectedDate = useSelector((state: RootState) => state.phone.selectedDate);
    const isPhoneCallRecordAsc = useSelector((state: RootState) => state.phone.isPhoneCallRecordAsc);

    const dispatch = useDispatch();

    const getPhoneCallRecords = useCallback(
        (today: { year: number; month: number; date: number }) => dispatch(getPhoneCallRecordsAsync.request(today)),
        [dispatch]
    );

    const addPhoneCallRecord = useCallback(
        (
            receivedDatetime: number,
            customerIdx: number,
            customerName: string,
            phoneNumber: string,
            address: string,
            request: string
        ) =>
            dispatch(
                addPhoneCallRecordAsync.request({
                    receivedDatetime,
                    customerIdx,
                    customerName,
                    phoneNumber,
                    address,
                    request,
                })
            ),
        [dispatch]
    );

    const removePhoneCallRecord = useCallback(
        (phoneCallRecordIdx: number) => dispatch(removePhoneCallRecordAsync.request(phoneCallRecordIdx)),
        [dispatch]
    );

    const setSelectedDate = useCallback((selectedDate: Date | null) => dispatch(setSelectedDateAction(selectedDate)), [
        dispatch,
    ]);
    const setRegisteredPhoneDevices = useCallback(
        (selectedDevices: Device[]) => dispatch(setRegiteredPhoneDevicesAction(selectedDevices)),
        [dispatch]
    );
    const setIsPhoneCallRecordAsc = useCallback(
        (isPhoneCallRecordAsc: boolean) => dispatch(setIsPhoneCallRecordAscAction(isPhoneCallRecordAsc)),
        [dispatch]
    );

    return {
        registeredPhoneDevices,
        phoneCallRecords,
        selectedDate,
        isPhoneCallRecordAsc,
        getPhoneCallRecords,
        addPhoneCallRecord,
        removePhoneCallRecord,
        setRegisteredPhoneDevices,
        setSelectedDate,
        setIsPhoneCallRecordAsc,
    };
};

export default usePhone;
