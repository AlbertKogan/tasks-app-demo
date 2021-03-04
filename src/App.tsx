import { Fragment, useEffect, createContext, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Board from "./component/Board";

import { getData, streamTasks } from "./lib/firestore";
import { StorageContext, Status, Task } from "./interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: theme.palette.grey[100]
    }
  })
);

export const DataContext = createContext<StorageContext | null>(null);

export default function App() {
  const classes = useStyles();
  const [statuses, setStatuses] = useState([] as Status[]);
  const [tasks, setTasks] = useState([] as Task[]);
  const [activeBoard, setActiveBoard] = useState({ id: '' });

  // Get data once
  useEffect(() => {
    getData().then(({ statusesData, boardData }) => {
      setStatuses(statusesData);
      setActiveBoard(boardData)
    });
  }, []);

  useEffect(() => {
    if (activeBoard.id) {
      const unsubscribe = streamTasks(activeBoard.id, {
        next: (querySnapshot: any) => {
          const tasks = querySnapshot.docs.map(
            (docSnapshot: any) => ({ id: docSnapshot.id, ...docSnapshot.data() })
          );
          setTasks(tasks);
        },
        error: () => console.log("Failed to get tasks"),
      });
  
      return unsubscribe;
    }
  }, [activeBoard.id]);

  const Storage: StorageContext = {
    statuses,
    tasks,
    activeBoard,
  };

  return (
    <DataContext.Provider value={Storage}>
      <Fragment>
        <CssBaseline />
        <AppBar position="static">
          <Toolbar variant="dense">
            <Typography variant="h6" color="inherit">
              Kanban boards
            </Typography>
          </Toolbar>
        </AppBar>
        <Container className={classes.wrapper}>
          <Board />
        </Container>
      </Fragment>
    </DataContext.Provider>
  );
}
