import { DraggableProvided } from "react-beautiful-dnd";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Delete from "@material-ui/icons/Delete";
import clsx from "clsx";
import { contentType } from "./data";

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
    })
);

interface ProductProps {
    content: contentType;
    isDragging: boolean;
    provided: DraggableProvided;
}

const Content = ({ content, isDragging, provided }: ProductProps) => {
    const classes = useStyles();

    return (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <div className={clsx(classes.root, isDragging && classes.isDragging)}>
                <Grid container spacing={1}>
                    <Grid item xs={9} className={classes.centerAlign}>
                        {content.value}
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid
                        item
                        xs={1}
                        className={clsx(classes.centerAlign, classes.hover, content.valueType !== "text" && classes.dn)}
                    >
                        <Delete />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Content;
