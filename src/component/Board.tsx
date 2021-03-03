import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import BoardHeader from "./BoardHeader";
import CardPlaceholder from "./CardPlaceholder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
  })
);

export default function Board() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} spacing={2}>
      <BoardHeader />
      <Grid item xs={12}>
        <Grid container justify="space-between" spacing={2}>
          {[0, 1, 2, 3].map((value) => (
            <Grid key={value} item>
              <CardPlaceholder />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
