import { useState, useCallback, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import { getDevices } from "util/cid";
import { getValidDeviceName } from "util/cid/device";
import { Device } from "node-hid";
import InnerList from "./InnerList";
import usePhone from "hook/usePhone";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 20,
        height: "calc(100vh - 168px)",
    },
    searchButton: {
        paddingBottom: 20,
    },
    notice: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: 20,
    },
    dn: {
        display: "none",
    },
}));

const CidList = () => {
    const classes = useStyles();
    const [devices, setDevices] = useState<Device[]>(() => getDevices());
    const [selectedIdxes, setSelectedIdxes] = useState([] as number[]);

    const { registeredPhoneDevices, setRegisteredPhoneDevices } = usePhone();

    // 로컬스토리지에 등록된 기기가 현재 연결돼 있지 않으면 로컬스토리지에서 제거하는 로직
    useEffect(() => {
        // selectedDevices에 있지만 devices(현재 검색된 목록)에 없으면 localStorage에서 제거
        const newSelectedDevices = registeredPhoneDevices
            .filter(
                (registeredPhoneDevice) =>
                    !!devices.find(
                        (device) => getValidDeviceName(device) === getValidDeviceName(registeredPhoneDevice.device)
                    )
            )
            .map((phone) => phone.device);
        localStorage.setItem("selectedDevices", JSON.stringify(newSelectedDevices));

        // devices에 있는 device.path와 selectedDevices에 있는 device.path가 같으면 selectedIdxes에 추가
        const selectedIdxes: number[] = [];
        devices.forEach((device, idx) => {
            newSelectedDevices.forEach((selectedDevice) => {
                if (device.path === selectedDevice.path) {
                    selectedIdxes.push(idx);
                }
            });
        });
        setSelectedIdxes(selectedIdxes);
    }, [devices, registeredPhoneDevices]);

    const handleSearchClick = useCallback(() => {
        setDevices(getDevices());
    }, []);

    const handleItemClick = useCallback(
        (idx: number) => () => {
            const currentIdx = selectedIdxes.indexOf(idx);
            const newSelectedIdxes = [...selectedIdxes];
            if (currentIdx === -1) {
                newSelectedIdxes.push(idx);
            } else {
                newSelectedIdxes.splice(currentIdx, 1);
            }

            const selectedDevices = devices.filter((device, idx) => newSelectedIdxes.includes(idx));
            const jsonData = JSON.stringify(selectedDevices);

            // 로컬스토리지, store, state 세 개 변경
            localStorage.setItem("selectedDevices", jsonData);
            setRegisteredPhoneDevices(selectedDevices);
            setSelectedIdxes(newSelectedIdxes);
        },
        [devices, selectedIdxes, setRegisteredPhoneDevices]
    );

    return (
        <Paper className={classes.root}>
            <Box display="flex" flexDirection="column">
                <Box className={classes.searchButton}>
                    <Button onClick={handleSearchClick} variant="contained" color="primary">
                        컴퓨터에 연결된 장치 목록 갱신
                    </Button>
                </Box>
                <Box className={clsx(classes.notice, devices.length === 0 && classes.dn)}>
                    사용할 CID 장치를 선택해주세요.
                </Box>
                <Box>
                    <InnerList devices={devices} selectedIdxes={selectedIdxes} handleItemClick={handleItemClick} />
                </Box>
            </Box>
        </Paper>
    );
};

export default CidList;
