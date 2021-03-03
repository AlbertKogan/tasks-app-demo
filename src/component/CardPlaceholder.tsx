import { Fragment } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import BoardCard from "./BoardCard";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    cardPlaceholder: {
      backgroundColor: theme.palette.grey[300],
    },
  })
);

export default function CardPlaceholder() {
  const classes = useStyles();

  return (
    <Grid item className={classes.cardPlaceholder}>
      <Fragment>
        <BoardCard />
        <BoardCard />
      </Fragment>

      <Box>
        <Button variant="contained" color="secondary" startIcon={<AddIcon />}>
          Add new card
        </Button>
      </Box>
    </Grid>
  );
}
