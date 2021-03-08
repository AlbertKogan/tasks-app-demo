import { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import DeleteIcon from '@material-ui/icons/Delete';

import { useDrag } from 'react-dnd';

import BoardCardDraft from './BoardCardDraft';
import appStore from '../Store';
import { DataContext } from '../App';
import { Task, Status, StorageContext } from '../interfaces';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginBottom: 10
  },
  pos: {
    marginBottom: 12,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});

export default function BoardCard({
  data,
  setIsDraft,
}: {
  data: Task;
  setIsDraft: (flag: boolean) => void;
}) {
  const classes = useStyles();
  const dataGlobal = useContext(DataContext) as StorageContext;
  const statuses = dataGlobal.statuses;
  const [statusOrderMin, statusOrderMax] = [
    statuses[0].order,
    statuses.slice(-1)[0].order,
  ];
  const currentStatus = statuses.find((s: Status) => s.id === data.status);
  const statusByOrder = statuses.reduce((acc: any, item: Status) => {
    acc[item.order] = item;
    return acc;
  }, {});

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      item: { type: 'card', data },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1,
      }),
    }),
    []
  );

  if (data.isDraft) {
    return <BoardCardDraft data={data} setIsDraft={setIsDraft} />;
  }

  return (
    <Card className={classes.root} ref={dragRef} style={{ opacity }}>
      <CardContent>
        <Typography
          variant="h5" 
          component="h5"
          gutterBottom
        >
          {data.title}
        </Typography>
        <Typography variant="body2" component="p" color="textSecondary">
          {data.description}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div>
          {currentStatus!.order > statusOrderMin && (
            <IconButton
              size="small"
              color="secondary"
              onClick={() =>
                appStore.updateTask(dataGlobal.activeBoard.id, data.id, {
                  status: statusByOrder[currentStatus!.order - 1].id,
                })
              }
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
          )}
          {currentStatus!.order < statusOrderMax && (
            <IconButton
              size="small"
              color="secondary"
              onClick={() =>
                appStore.updateTask(dataGlobal.activeBoard.id, data.id, {
                  status: statusByOrder[currentStatus!.order + 1].id,
                })
              }
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          )}
        </div>

        <IconButton
          size="small"
          variant="text"
          color="primary"
          onClick={() => appStore.deleteTask(dataGlobal.activeBoard.id, data.id)}
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
