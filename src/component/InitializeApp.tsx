import { useEffect } from "react";
import { getPhoneNumberFromDataByDevice, getValidDeviceName } from "util/cid/device";
import { getCustomers } from "db/customer";
import { Customer } from "module/customer";
import { createPhonCallPopup } from "util/phone";
import useCategory from "hook/useCategory";
import usePhone from "hook/usePhone";
import usePrinter from "hook/usePrinter";

// React 초기화 로직을 담은 컴포넌트
const InitializeApp = () => {
    const { registeredPhoneDevices, setRegisteredPhoneDevices, addPhoneCallRecord } = usePhone();
    const { getCategories } = useCategory();
    const { setSelectedPrinter, setPapersOptions, setPapersContents } = usePrinter();

    // 앱 실행시 localStorage에서 정보 가져오기
    useEffect(() => {
        // 기기정보 가져오기
        const selectedDevices = localStorage.getItem("selectedDevices");
        if (selectedDevices) {
            setRegisteredPhoneDevices(JSON.parse(selectedDevices));
        }
        // 프린터 정보 가져오기
        const selectedPrinter = localStorage.getItem("selectedPrinter");
        if (selectedPrinter) {
            setSelectedPrinter(selectedPrinter);
        }
        // 프린터 옵션 정보 가져오기
        const papersOptions = localStorage.getItem("papersOptions");
        if (papersOptions) {
            setPapersOptions(JSON.parse(papersOptions));
        }
        // 프린터 내용 정보 가져오기
        const papersContents = localStorage.getItem("papersContents");
        if (papersContents) {
            setPapersContents(JSON.parse(papersContents));
        }
    }, [setPapersContents, setPapersOptions, setRegisteredPhoneDevices, setSelectedPrinter]);

    useEffect(() => {
        // 전화 수신시 발신전화 표시 로직
        registeredPhoneDevices.forEach(({ device, hid }) => {
            hid.on("data", async (data) => {
                const receivedDatetime = Date.now();
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
                        createPhonCallPopup({ receivedDatetime, phoneNumber, customerName, address, customerRequest });
                        addPhoneCallRecord(receivedDatetime, customerName, phoneNumber, address, customerRequest);
                    }
                } catch (e) {
                    alert(e);
                }
            });
            hid.on("error", (error) => {
                console.error(error);
                hid.close();
            });
        });
        getCategories();
    }, [addPhoneCallRecord, getCategories, registeredPhoneDevices]);

    return <></>;
};

export default InitializeApp;
