import { Fragment } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';


import Board from "./component/Board";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: theme.palette.grey[100]
    }
  })
);

export default function App() {
  const classes = useStyles();

  return (
    <Fragment>
      <CssBaseline />
       <AppBar position="static">
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Kanban boards
          </Typography>
        </Toolbar>
      </AppBar>
      <Container className={ classes.wrapper }>
        <Board />
      </Container>
    </Fragment>
  );
}
