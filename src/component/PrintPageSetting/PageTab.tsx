import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import TabContent from "./TabContent";
import Paper from "@material-ui/core/Paper";
import usePrinter from "hook/usePrinter";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && children}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

const PageTab = () => {
    const classes = useStyles();
    const { currentPaperIndex, setCurrentPaperIndex } = usePrinter();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setCurrentPaperIndex(newValue);
    };

    return (
        <Paper className={classes.root}>
            <AppBar position="static">
                <Tabs value={currentPaperIndex} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="용지 1" {...a11yProps(0)} />
                    <Tab label="용지 2" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={currentPaperIndex} index={0}>
                <TabContent index={0} />
            </TabPanel>
            <TabPanel value={currentPaperIndex} index={1}>
                <TabContent index={1} />
            </TabPanel>
        </Paper>
    );
};

export default PageTab;
