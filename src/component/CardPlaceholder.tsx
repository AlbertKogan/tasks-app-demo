import { useCallback, useContext, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import BoardCard from './BoardCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';

import { DataContext } from './../App';
import { updateTask } from './../lib/firestore';

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
      backgroundColor: theme.palette.grey[300],
    },
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
      updateTask(data.activeBoard.id, item.data.id, { status });
    },
    [data.activeBoard.id, status]
  );

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'card',
      drop: (item) => handleDrop(item),
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
    <Grid
      item
      className={classes.cardPlaceholder}
      ref={drop}
      style={{ backgroundColor: isActive ? 'red' : 'white' }}
    >
      <Grid key={statusData.id} item>
        <Box>
          <Typography>{statusData.displayName}</Typography>
          <IconButton size="small" onClick={() => setIsDraft(true)}>
            <AddIcon />
          </IconButton>
        </Box>
      </Grid>

      <Grid>
        {cardsByStatus.map((card: any) => (
          <BoardCard key={card.id} data={card} setIsDraft={setIsDraft} />
        ))}
      </Grid>

      <Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setIsDraft(true)}
        >
          Add new card
        </Button>
      </Box>
    </Grid>
  );
}
