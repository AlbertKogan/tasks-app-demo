import React, { ChangeEvent } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { Divider, FormControl, NativeSelect } from "@material-ui/core";

import Typography from "@material-ui/core/Typography";

import { Board as BoardInterface } from "./../interfaces";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerWrapper: {
      display: 'flex',
    },
    headerContent: {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
    },
    title: {
      paddingRight: 20,
      display: 'flex',
      alignItems: 'baseline',
    },
    select: {
      width: '100%',
      color: 'white',
      padding: 5
    },
    selectWrapper: {
      paddingLeft: 20,
    }
  })
);

interface HeaderComponentInterface {
  boards: BoardInterface[], 
  activeBoard: BoardInterface,
  setActiveBoard: (board: BoardInterface) => void  
}

export default function Header({
  boards,
  activeBoard,
  setActiveBoard,
}: HeaderComponentInterface) {
    const classes = useStyles();
    
    return (
      <AppBar className={classes.headerWrapper} position="static">
        <Toolbar className={classes.headerContent} variant="dense">
          <div className={ classes.title} data-testid="HeaderTitle">
            <Typography variant="h6" color="inherit" data-testid="HeaderTitleBoard">
              { `${activeBoard.displayName} board` }
            </Typography>
            <Typography data-testid="HeaderTitleCount">
              &nbsp; with {activeBoard.taskCount || 0} tasks
            </Typography>
          </div>

          <Divider orientation="vertical" flexItem />

          <FormControl className={classes.selectWrapper}>
              <NativeSelect
                variant="standard"
                className={classes.select}
                value={activeBoard.id}
                onChange={
                  (event: ChangeEvent<{ value: unknown }>) => 
                    setActiveBoard(
                      boards.find((b) => b.id === event.target.value) as BoardInterface
                    )
                }
              >
                <option key="disabled" value="" disabled>
                  Pick board
                </option>
                { 
                  boards.map(
                    (board) => (
                      <option key={board.id} value={board.id}>
                        {board.displayName}
                      </option>
                    )
                  )
                }
              </NativeSelect>
          </FormControl>
        </Toolbar>
      </AppBar>
    );
}
