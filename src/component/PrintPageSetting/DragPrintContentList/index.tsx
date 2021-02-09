import React, { useCallback, useState } from "react";
import ContentList from "./ContentList";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import reorder from "component/DragProductList/reorder";
import { contentType } from "./data";

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

interface DragPrintContentListProps {
    initial: contentType[];
}

const DragPrintContentList = ({ initial }: DragPrintContentListProps) => {
    const classes = useStyles();
    const [contents, setContents] = useState(initial);

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
                const newContents = reorder(contents, source.index, destination.index);
                setContents(newContents);
                return;
            }
        },
        [contents]
    );

    return (
        <div className={classes.root}>
            <DragDropContext onDragEnd={onDragEnd}>
                <ContentList contents={contents} />
            </DragDropContext>
        </div>
    );
};

export default DragPrintContentList;
