import React, { Fragment, useEffect, createContext, useState } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Board from "./component/Board";
import Header from "./component/Header";

import { getData, streamTasks, streamBoardCount } from "./lib/firestore";
import { StorageContext, Status, Task, Board as BoardInterface } from "./interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      paddingTop: '20px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 320,
    },
    select: {
      width: '100%',
      color: 'white',
      padding: 5
    }
  })
);

export const DataContext = createContext<StorageContext | null>(null);

export default function App() {
  const classes = useStyles();
  const [statuses, setStatuses] = useState([] as Status[]);
  const [tasks, setTasks] = useState([] as Task[]);
  const [activeBoard, setActiveBoard] = useState({ id: '' , displayName: '', isActive: false, taskCount: 0 });
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

  useEffect(() => {
    if (activeBoard.id) {
      const unsubscribe = streamBoardCount(activeBoard.id, {
        next: (querySnapshot: any) => {
          setActiveBoard({
            id: querySnapshot.id,
            ...querySnapshot.data()
          });
        },
        error: () => console.log("Failed to get board"),
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
        <Header boards={boards} 
                activeBoard={activeBoard}
                setActiveBoard={setActiveBoard} />
        <Container className={classes.wrapper}>
          <Board />
        </Container>
      </Fragment>
    </DataContext.Provider>
  );
}
