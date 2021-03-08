import React, { useCallback, useContext, useState } from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import BoardCard from './BoardCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import { DataContext } from './../App';
import appStore from './../Store';

import { useDrop } from 'react-dnd';

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
      background: 'transparent',
    },
    cardPlaceholderActive: {
      background: theme.palette.grey[100],
    },
    cardPlaceholderHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
    },
    cardPlaceholderBottom: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    cardPlaceholderContent: {
      padding: 10,
    }
  })
);

interface CardPlaceholderProps {
  status: string;
}

export default function CardPlaceholder({ status }: CardPlaceholderProps) {
  const classes = useStyles();

  const data: any = useContext(DataContext);
  const [isDraft, setIsDraft] = useState(false);

  const handleDrop = useCallback(
    (item) => {
      console.info('Handle drop event for', data.activeBoard.id, item.data.id, status);
      appStore.updateTask(data.activeBoard.id, item.data.id, { status });
    },
    [data.activeBoard.id, status]
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop: handleDrop,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    []
  );

  const isActive = isOver && canDrop;
  const cardsByStatus = [
    ...data.tasks.filter((task: any) => task.status === status),
    ...(isDraft ? [{ isDraft, id: 'draft', status }] : []),
  ];
  const statusData = data.statuses.find((s: any) => s.id === status);

  return (
    <div
      className={ 
        clsx(
          classes.cardPlaceholder, 
          isActive && classes.cardPlaceholderActive
        ) 
      }
      ref={drop}
    >
      <div key={statusData.id} className={classes.cardPlaceholderHeader}>
        <Typography>{statusData.displayName}</Typography>
        <IconButton size="small" onClick={() => setIsDraft(true)}>
          <AddIcon />
        </IconButton>
      </div>

      <div className={classes.cardPlaceholderContent}>
        {cardsByStatus.map((card: any) => (
          <BoardCard key={card.id} data={card} setIsDraft={setIsDraft} />
        ))}
      </div>

      <div className={classes.cardPlaceholderBottom} data-testid="AddNewTaskButton">
        <Button
          variant="text"
          size="small"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsDraft(true)}
        >
          Add new task
        </Button>
      </div>
    </div>
  );
}
