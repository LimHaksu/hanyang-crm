import React, { useCallback, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { CheckItem } from "module/printer";
import usePrinter from "hook/usePrinter";

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

const listItems: CheckItem[] = [
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
    const [message, setMessage] = useState("");
    const { currentPaperIndex, papersOptions, togglePrintAvailable, toggleCheckItem, addPaperContent } = usePrinter();
    const paperOptions = papersOptions[index];
    // TODO... papersOptions와 papersContens 가 바뀌었을때 로컬스토리지에 저장하는 로직 작성

    const handlePrintCheckClick = useCallback(() => {
        togglePrintAvailable(currentPaperIndex, !paperOptions.printAvailable);
    }, [currentPaperIndex, paperOptions.printAvailable, togglePrintAvailable]);

    const handleItemClick = useCallback(
        (item: CheckItem) => () => {
            toggleCheckItem(index, item);
        },
        [index, toggleCheckItem]
    );

    const handleMessageChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    const handleAddMessageClick = useCallback(() => {
        addPaperContent(currentPaperIndex, { type: "text", valueType: "text", value: message });
        setMessage("");
    }, [addPaperContent, currentPaperIndex, message]);

    const handleEnter = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
                handleAddMessageClick();
            }
        },
        [handleAddMessageClick]
    );
    return (
        <div className={classes.root}>
            {/* value에는 해당 탭 정보 */}
            <FormControlLabel
                control={<Checkbox checked={paperOptions.printAvailable} onClick={handlePrintCheckClick} />}
                label="체크하면 인쇄합니다."
            />
            <div className={classes.title}>인쇄할 내용</div>
            <List className={classes.list}>
                {listItems.map((item, idx) => (
                    <ListItem key={idx} button onClick={handleItemClick(item)}>
                        <ListItemIcon>
                            <Checkbox
                                value={item.value}
                                checked={!!paperOptions.checkedList.find((c) => c.value === item.value)}
                            />
                        </ListItemIcon>
                        {item.name}
                    </ListItem>
                ))}
            </List>
            <div className={classes.title}>고정 문구 추가 입력</div>
            <TextField
                id="standard-full-width"
                value={message}
                className={classes.text}
                placeholder="문구를 입력해주세요."
                fullWidth
                onChange={handleMessageChange}
                onKeyUp={handleEnter}
            />
            <Box display="flex">
                <Box flexGrow={1}></Box>
                <Box>
                    <Button variant="contained" color="primary" onClick={handleAddMessageClick}>
                        추가
                    </Button>
                </Box>
            </Box>
        </div>
    );
};

export default TabContent;
