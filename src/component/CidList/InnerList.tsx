import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import clsx from "clsx";
import { supportedDevices, deviceType } from "util/cid";

const useStyles = makeStyles((theme: Theme) => ({
    list: {
        boxSizing: "border-box",
        overflowY: "auto",
        maxHeight: "calc(100vh - 241px)",
        backgroundColor: theme.palette.background.paper,
    },
    dn: {
        display: "none",
    },
    supportedDevices: {
        color: "#fff",
        fontSize: "0.9rem",
        backgroundColor: theme.palette.primary.light,
        borderRadius: 10,
        padding: 6,
        marginLeft: 10,
    },
}));

interface InnserListProps {
    devices: deviceType[];
    handleItemClick: (idx: number) => () => void;
    selectedIdxes: number[];
}

const InnerList = ({ devices, handleItemClick, selectedIdxes }: InnserListProps) => {
    const classes = useStyles();

    return (
        <List className={classes.list}>
            {devices.map((device, idx) => (
                <ListItem key={idx} button onClick={handleItemClick(idx)}>
                    <ListItemIcon>
                        <Checkbox checked={selectedIdxes.includes(idx)} />
                    </ListItemIcon>
                    <div>{device.product ? device.product : "(이름없는 기기)"}</div>
                    <div
                        className={clsx(
                            classes.supportedDevices,
                            !supportedDevices.includes(device.product) && classes.dn
                        )}
                    >
                        지원 장치
                    </div>
                </ListItem>
            ))}
        </List>
    );
};

export default InnerList;
