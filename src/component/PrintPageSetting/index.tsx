import PageTab from "./PageTab";
import Preview from "./Preview";
import Box from "@material-ui/core/Box";
import { makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
    left: {
        marginRight: 15,
    },
}));

const PrintPageSetting = () => {
    const classes = useStyles();

    return (
        <Box display="flex">
            <div className={classes.left}>
                <PageTab />
            </div>
            <Preview />
        </Box>
    );
};

export default PrintPageSetting;
