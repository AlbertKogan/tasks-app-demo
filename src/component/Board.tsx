import React, { useContext } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import CardPlaceholder from './CardPlaceholder';
import { DataContext } from './../App';
import { Status, StorageContext } from '../interfaces';

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
  const data = useContext(DataContext) as StorageContext;

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid
        data-testid="BoardContent"
        container
        justify="space-between"
        className={classes.root}
        spacing={2}
      >
        {data.statuses.map((status: Status) => (
          <Grid key={status.id} item xs={3}>
            <CardPlaceholder status={status.id} key={status.id} />
          </Grid>
        ))}
      </Grid>
    </DndProvider>
  );
}
