import { useState, useCallback, useEffect } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import clsx from "clsx";
import { getDevices, deviceType } from "util/cid";
import InnerList from "./InnerList";

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
    const [devices, setDevices] = useState<deviceType[]>(() => getDevices());
    const [selectedIdxes, setSelectedIdxes] = useState([] as number[]);
    const [selectedDevices, setSelectedDevices] = useState<deviceType[]>(() => {
        const savedDevices = localStorage.getItem("selectedDevices");
        if (savedDevices) {
            return JSON.parse(savedDevices);
        }
        return [];
    });

    useEffect(() => {
        // selectedDevices에 있지만 devices에 없으면 localStorage에서 제거
        const newSelectedDevices = selectedDevices.filter(
            (selectedDevice) => !!devices.find((device) => device.product === selectedDevice.product)
        );
        localStorage.setItem("selectedDevices", JSON.stringify(newSelectedDevices));

        // devices에 있는 device의 path와 selectedDevices에 있는 device의 path가 같으면 selectedIdxes에 추가
        const selectedIdxes: number[] = [];
        devices.forEach((device, idx) => {
            newSelectedDevices.forEach((selectedDevice) => {
                if (device.path === selectedDevice.path) {
                    selectedIdxes.push(idx);
                }
            });
        });
        setSelectedIdxes(selectedIdxes);
    }, [devices]);

    useEffect(() => {
        const selectedDevices = devices.filter((device, idx) => selectedIdxes.includes(idx));
        const jsonData = JSON.stringify(selectedDevices);
        localStorage.setItem("selectedDevices", jsonData);
        setSelectedDevices(selectedDevices);
    }, [selectedIdxes]);

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
            setSelectedIdxes(newSelectedIdxes);
        },
        [selectedIdxes]
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
