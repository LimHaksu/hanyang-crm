import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Content from "./Content";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import usePrinter from "hook/usePrinter";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        isDragging: {
            boxShadow: "3px 3px 5px black",
        },
        isDraggingOver: {
            backgroundColor: "#c2c2c2",
        },
        dropZone: {
            minHeight: "10px",
        },
    })
);

const InnerProductList = React.memo(() => {
    const { currentPaperIndex, papersContents } = usePrinter();
    return (
        <>
            {papersContents[currentPaperIndex].map((content, index: number) => (
                <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                    {(dragProvided, dragSnapshot) => (
                        <Content
                            key={index}
                            index={index}
                            content={content}
                            isDragging={dragSnapshot.isDragging}
                            provided={dragProvided}
                        />
                    )}
                </Draggable>
            ))}
        </>
    );
});

interface InnerListProps {
    dropProvided: any;
}

const InnerList = ({ dropProvided }: InnerListProps) => {
    const classes = useStyles();

    return (
        <div className={classes.dropZone} ref={dropProvided.innerRef}>
            <InnerProductList />
            {dropProvided.placeholder}
        </div>
    );
};

const ContentList = () => {
    const classes = useStyles();

    return (
        <Droppable droppableId="print" type="PRINT">
            {(dropProvided, dropSnapshot) => (
                <div
                    className={dropSnapshot.isDraggingOver ? classes.isDraggingOver : ""}
                    {...dropProvided.droppableProps}
                >
                    <InnerList dropProvided={dropProvided} />
                </div>
            )}
        </Droppable>
    );
};

export default ContentList;
