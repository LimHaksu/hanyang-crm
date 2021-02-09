import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Content from "./Content";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { contentType } from "./data";

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
interface InnerQuoteListProps {
    contents: contentType[];
}

const InnerProductList = React.memo(({ contents }: InnerQuoteListProps) => {
    return (
        <>
            {contents.map((content, index: number) => (
                <Draggable key={content.idx} draggableId={`${content.idx}`} index={index}>
                    {(dragProvided, dragSnapshot) => (
                        <Content
                            key={content.idx}
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
    contents: contentType[];
    dropProvided: any;
}

const InnerList = ({ contents, dropProvided }: InnerListProps) => {
    const classes = useStyles();

    return (
        <div className={classes.dropZone} ref={dropProvided.innerRef}>
            <InnerProductList contents={contents} />
            {dropProvided.placeholder}
        </div>
    );
};

interface ContentListProps {
    contents: contentType[];
}
const ContentList = ({ contents }: ContentListProps) => {
    const classes = useStyles();

    return (
        <Droppable droppableId="print" type="PRINT">
            {(dropProvided, dropSnapshot) => (
                <div
                    className={dropSnapshot.isDraggingOver ? classes.isDraggingOver : ""}
                    {...dropProvided.droppableProps}
                >
                    <InnerList contents={contents} dropProvided={dropProvided} />
                </div>
            )}
        </Droppable>
    );
};

export default ContentList;
