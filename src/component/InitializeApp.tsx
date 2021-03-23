import { useEffect } from "react";
import { getPhoneNumberFromDataByDevice, getValidDeviceName } from "util/cid/device";
import { getCustomers } from "db/customer";
import { Customer } from "module/customer";
import { createPhonCallPopup } from "util/phone";
import useCategory from "hook/useCategory";
import usePhone from "hook/usePhone";
import usePrinter from "hook/usePrinter";
import useOrder from "hook/useOrder";

// React 초기화 로직을 담은 컴포넌트
const InitializeApp = () => {
    const {
        registeredPhoneDevices,
        setRegisteredPhoneDevices,
        addPhoneCallRecord,
        setIsPhoneCallRecordAsc,
    } = usePhone();
    const { getCategories } = useCategory();
    const { setSelectedPrinter, setPapersOptions, setPapersContents, setSerialPrinterConfig } = usePrinter();
    const { setIsOrderAsc, setFirstOrderDateAsc } = useOrder();

    // 앱 초기 세팅
    useEffect(() => {
        const localStorageItemSetters: { [key: string]: Function } = {
            isOrderAsc: setIsOrderAsc, // 주문 정렬 순서 T/F
            isPhoneCallRecordAsc: setIsPhoneCallRecordAsc, // 전화 기록 정렬 순서 T/F
            selectedDevices: setRegisteredPhoneDevices, // 기기 정보
            selectedPrinter: setSelectedPrinter, // 프린터 정보
            papersOptions: setPapersOptions, // 프린터 옵션 정보
            papersContents: setPapersContents, // 프린터 내용 정보
            serialPrinterConfig: setSerialPrinterConfig, // 시리얼 포트 프린터 설정
        };
        // 앱 실행시 localStorage에서 정보 가져오기
        for (const key of Object.keys(localStorageItemSetters)) {
            const item = localStorage.getItem(key);
            if (item) {
                const parsedItem = key === "selectedPrinter" ? item : JSON.parse(item);
                localStorageItemSetters[key](parsedItem);
            }
        }

        // 첫 주문 날짜 가져오기 (통계에서 사용)
        setFirstOrderDateAsc();
    }, [
        setFirstOrderDateAsc,
        setIsOrderAsc,
        setIsPhoneCallRecordAsc,
        setPapersContents,
        setPapersOptions,
        setRegisteredPhoneDevices,
        setSelectedPrinter,
        setSerialPrinterConfig,
    ]);

    useEffect(() => {
        // 전화 수신시 발신전화 표시 로직
        registeredPhoneDevices.forEach(({ device, hid }) => {
            hid.on("data", async (data) => {
                const receivedDatetime = Date.now();
                const deviceName = getValidDeviceName(device);
                try {
                    const phoneNumber = getPhoneNumberFromDataByDevice(deviceName, data);
                    // 전화번호로 db에 유저 있는지 조회하기
                    let customerIdx = -1;
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
                            customerIdx = customer.idx;
                            customerName = customer.customerName;
                            address = customer.address;
                            customerRequest = customer.request;
                        }
                        createPhonCallPopup({ receivedDatetime, phoneNumber, customerName, address, customerRequest });
                        addPhoneCallRecord(
                            receivedDatetime,
                            customerIdx,
                            customerName,
                            phoneNumber,
                            address,
                            customerRequest
                        );
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
