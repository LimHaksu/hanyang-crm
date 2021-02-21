import { useEffect, useState } from "react";
import useCategory from "hook/useCategory";
import usePhone from "hook/usePhone";
import { getPhoneNumberFromDataByDevice, getValidDeviceName } from "util/cid/device";
import { getCustomers } from "db/customer";
import { Customer } from "module/customer";
import { createPhonCallPopup } from "util/phone";
import { Device } from "node-hid";

// React 초기화 로직을 담은 컴포넌트
const InitializeApp = () => {
    const { registeredPhoneDevices, setRegisteredPhoneDevices } = usePhone();
    const { getCategories } = useCategory();
    const [selectedDevices, setSelectedDevices] = useState<Device[]>(() => {
        const savedDevices = localStorage.getItem("selectedDevices");
        if (savedDevices) {
            return JSON.parse(savedDevices);
        }
        return [];
    });

    // 앱 실행시 localStorage에 저장된 기기정보 가져오기
    useEffect(() => {
        setRegisteredPhoneDevices(selectedDevices);
    }, [selectedDevices, setRegisteredPhoneDevices]);

    useEffect(() => {
        // 전화 수신시 발신전화 표시 로직
        registeredPhoneDevices.forEach(({ device, hid }) => {
            hid.on("data", async (data) => {
                const phoneCallTime = Date.now();
                const deviceName = getValidDeviceName(device);
                try {
                    const phoneNumber = getPhoneNumberFromDataByDevice(deviceName, data);
                    // 전화번호로 db에 유저 있는지 조회하기
                    let customerName = "";
                    let address = "";
                    let customerRequest = "";
                    if (phoneNumber) {
                        const customers: Customer[] = await getCustomers({
                            searchBy: "phoneNumber",
                            keyword: phoneNumber,
                        });
                        if (customers.length > 0) {
                            const [customer] = customers;
                            customerName = customer.customerName;
                            address = customer.address;
                            customerRequest = customer.request;
                        }
                        createPhonCallPopup({ phoneCallTime, phoneNumber, customerName, address, customerRequest });
                        // TODO... 전화 수신 기록 페이지에 데이터를 저장하는 로직
                    }
                } catch (e) {
                    alert(e);
                }
            });
            hid.on("error", (error) => {
                console.error(error);
            });
        });
        getCategories();
    }, [getCategories, registeredPhoneDevices]);

    return <></>;
};

export default InitializeApp;
