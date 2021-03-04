import React, { Fragment, useEffect, createContext, useState, ChangeEvent } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import Board from "./component/Board";

import { getData, streamTasks } from "./lib/firestore";
import { StorageContext, Status, Task, Board as BoardInterface } from "./interfaces";
import { FormControl, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      backgroundColor: theme.palette.grey[100]
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 320,
    },
    select: {
      width: '100%'
    }
  })
);

export const DataContext = createContext<StorageContext | null>(null);

export default function App() {
  const classes = useStyles();
  const [statuses, setStatuses] = useState([] as Status[]);
  const [tasks, setTasks] = useState([] as Task[]);
  const [activeBoard, setActiveBoard] = useState({ id: '' , displayName: '', isActive: false });
  const [boards, setBoards] = useState([] as BoardInterface[]);

  // Get data once
  useEffect(() => {
    getData().then(({ statusesData, boardsData, activeBoard }) => {
      setStatuses(statusesData);
      setBoards(boardsData);
      setActiveBoard(activeBoard);
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
            <FormControl class={classes.formControl} variant="filled">
              <Select
                class={classes.select}
                value={activeBoard.id}
                renderValue={ () => activeBoard.displayName }
                onChange={
                  (event: ChangeEvent<{ value: unknown }>) => 
                    setActiveBoard(
                      boards.find((b) => b.id === event.target.value) as BoardInterface
                    )
                }
              >
                { 
                  boards.map(
                    (board) => (
                      <MenuItem key={board.id} value={board.id}>
                        {board.displayName}
                      </MenuItem>
                    )
                  )
                }
              </Select>
            </FormControl>
          </Toolbar>
        </AppBar>
        <Container className={classes.wrapper}>
          <Board />
        </Container>
      </Fragment>
    </DataContext.Provider>
  );
}
