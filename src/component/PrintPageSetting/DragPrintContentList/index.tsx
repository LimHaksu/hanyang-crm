import React, { useCallback } from "react";
import ContentList from "./ContentList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import usePrinter from "hook/usePrinter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: "#fff",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "column",
            padding: 5,
            boxShadow: "3px 3px 4px 2px #222",
        },
        name: {
            fontWeight: "bold",
            fontSize: "1.4rem",
            padding: "15px",
            borderBottom: "1px solid #ddd",
        },
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
    })
);

const DragPrintContentList = () => {
    const classes = useStyles();
    const { currentPaperIndex, reorderPaperContents } = usePrinter();

    const onDragEnd = useCallback(
        (result: DropResult) => {
            const source = result.source;
            const destination = result.destination;

            if (destination) {
                // did not move anywhere - can bail early
                if (source.droppableId === destination.droppableId && source.index === destination.index) {
                    return;
                }

                // reordering column
                reorderPaperContents(currentPaperIndex, source.index, destination.index);
                return;
            }
        },
        [currentPaperIndex, reorderPaperContents]
    );

    return (
        <div className={classes.root}>
            <DragDropContext onDragEnd={onDragEnd}>
                <ContentList />
            </DragDropContext>
        </div>
    );
};

export default DragPrintContentList;
