import React from "react";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

type ID =
    | "address"
    | "productName"
    | "map"
    | "idx"
    | "orderTime"
    | "customerName"
    | "phoneNumber"
    | "request"
    | "paymentMethod"
    | "price";

export const isPopOverCell = (id: ID) => {
    return id === "address" || id === "productName";
};

export const getPopOverMessageById = (id: ID) => {
    switch (id) {
        case "address":
            return "주소를 클릭하면 지도를 볼 수 있습니다.";
        case "productName":
            return "상품명을 클릭하면 주문내역을 수정할 수 있습니다.";
        default:
            return "";
    }
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            pointerEvents: "none",
        },
        paper: {
            padding: theme.spacing(1),
            backgroundColor: "#ffffe6",
        },
    })
);

interface Props {
    anchor: {
        el: HTMLElement | null;
        message: string | undefined;
    };
    handlePopoverClose: () => void;
}

const MouseoverPopover = ({ anchor, handlePopoverClose }: Props) => {
    const classes = useStyles();
    const open = Boolean(anchor.el);

    return (
        <Popover
            id="mouse-over-popover"
            className={classes.popover}
            classes={{
                paper: classes.paper,
            }}
            open={open}
            anchorEl={anchor.el}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
        >
            <Typography>{anchor.message}</Typography>
        </Popover>
    );
};

export default MouseoverPopover;
