import React, { useCallback } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        paper: {
            backgroundColor: theme.palette.background.paper,
            border: "2px solid #eee",
            boxShadow: theme.shadows[5],
            padding: theme.spacing(3, 4, 3),
        },
    })
);

interface StyledModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

const StyledModal = ({ open, setOpen, children }: StyledModalProps) => {
    const classes = useStyles();

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <Modal
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Paper className={classes.paper}>{children}</Paper>
            </Fade>
        </Modal>
    );
};

export default React.memo(StyledModal);
