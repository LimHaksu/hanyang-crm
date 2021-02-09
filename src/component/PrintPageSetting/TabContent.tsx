import React, { useState, useCallback } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 30,
        boxSizing: "border-box",
    },
    list: {
        width: "100%",
        maxHeight: "calc(100vh - 456px)",
        overflowY: "auto",
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        fontSize: "1.1rem",
        fontWeight: "bold",
        paddingTop: 10,
        borderTop: "1px solid #ccc",
    },
    text: {
        margin: "10px 0 10px 0",
    },
}));

const listItems = [
    { name: "순번", value: "orderNumber" },
    { name: "결제방법", value: "paymentMethod" },
    { name: "주문시각", value: "orderTime" },
    {
        name: "주소",
        value: "address",
    },
    { name: "연락처", value: "phoneNumber" },
    { name: "요청사항", value: "request" },
    { name: "메뉴", value: "menu" },
];

interface Props {
    index: number;
}

const TabContent = ({ index }: Props) => {
    const classes = useStyles();
    const [selectedIdxes, setSelectedIdxes] = useState([] as number[]);

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
        <div className={classes.root}>
            {/* value에는 해당 탭 정보 */}
            <FormControlLabel control={<Checkbox value={index} />} label="체크하면 인쇄합니다." />
            <div className={classes.title}>인쇄할 내용</div>
            <List className={classes.list}>
                {listItems.map((item, idx) => (
                    <ListItem key={idx} button onClick={handleItemClick(idx)}>
                        <ListItemIcon>
                            <Checkbox value={item.value} checked={selectedIdxes.includes(idx)} />
                        </ListItemIcon>
                        {item.name}
                    </ListItem>
                ))}
            </List>
            <div className={classes.title}>고정 문구 추가 입력</div>
            <TextField id="standard-full-width" className={classes.text} placeholder="문구를 입력해주세요." fullWidth />
            <Box display="flex">
                <Box flexGrow={1}></Box>
                <Box>
                    <Button variant="contained" color="primary">
                        추가
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default TabContent;
