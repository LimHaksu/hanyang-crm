import { useCallback, useState } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Delete from "@material-ui/icons/Delete";
import Modal from "component/Modal";
import clsx from "clsx";
import { PrintRowContent } from "module/printer";
import usePrinter from "hook/usePrinter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#fff",
            padding: "15px 15px 15px 25px",
            fontSize: "1.2rem",
            borderBottom: "1px dashed black",
        },
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
        centerAlign: {
            textAlign: "center",
        },
        rightAlign: {
            textAlign: "right",
        },
        hover: {
            "&:hover": {
                cursor: "pointer",
                color: theme.palette.secondary.main,
            },
        },
        dn: {
            display: "none",
        },
        text: {
            fontSize: "0.9rem",
        },
        modalMessage: {
            fontWeight: "bold",
            fontSize: "1.2rem",
            lineHeight: "2rem",
            marginBottom: "10px",
        },
    })
);

interface ProductProps {
    content: PrintRowContent;
    isDragging: boolean;
    provided: DraggableProvided;
    index: number;
}

const Content = ({ content, isDragging, provided, index }: ProductProps) => {
    const classes = useStyles();
    const { removePaperContent, currentPaperIndex } = usePrinter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemoveClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleRemoveOkClick = useCallback(() => {
        removePaperContent(currentPaperIndex, index);
        setIsModalOpen(false);
    }, [currentPaperIndex, index, removePaperContent]);

    const handleRemoveCancelClick = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <>
            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                <div className={clsx(classes.root, isDragging && classes.isDragging)}>
                    <Grid container spacing={1}>
                        <Grid item xs={9} className={content.valueType === "text" ? classes.text : classes.centerAlign}>
                            {content.valueType === "text" ? content.value : `[[ ${content.name} ]]`}
                        </Grid>
                        <Grid item xs={1}></Grid>
                        <Grid
                            item
                            xs={1}
                            className={clsx(
                                classes.centerAlign,
                                classes.hover,
                                content.valueType !== "text" && classes.dn
                            )}
                            onClick={handleRemoveClick}
                        >
                            <Delete />
                        </Grid>
                    </Grid>
                </div>
            </div>
            <Modal open={isModalOpen} setOpen={setIsModalOpen}>
                <Box display="flex" flexDirection="column">
                    <div className={classes.modalMessage}>
                        고정 문구
                        <br />"{content.value}"<br />
                        정말로 삭제하시겠습니까?
                    </div>
                    <Box display="flex" justifyContent="space-around">
                        <Button variant="outlined" color="primary" onClick={handleRemoveOkClick}>
                            예
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleRemoveCancelClick}>
                            아니오
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default Content;
