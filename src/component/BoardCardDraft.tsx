import { useContext, FormEvent, ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { useDebounce } from '@react-hook/debounce';

import { DataContext } from './../App';
import { addNewTask } from './../lib/firestore';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const useCardForm = (outerHandler: () => void): any => {
  const [title, setTitle] = useDebounce('');
  const [description, setDescription] = useDebounce('');

  const addNewTaskHandler = (boardId: string, status: string) => (
    event: FormEvent<HTMLFormElement>
  ): void => {
    event.preventDefault();

    outerHandler();
    addNewTask(boardId, {
      title,
      description,
      status,
    });
  };

  const titleHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const descriptionHandler = (e: ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);

  return [addNewTaskHandler, descriptionHandler, titleHandler];
};

export default function BoardCardDraft({
  data,
  setIsDraft,
}: {
  data: any;
  setIsDraft: (flag: boolean) => void;
}) {
  const classes = useStyles();
  const dataGlobal: any = useContext(DataContext);
  const [
    addNewTaskHandler,
    descriptionHandler,
    titleHandler,
  ] = useCardForm(() => setIsDraft(false));

  return (
    <Card className={classes.root}>
      <form
        className={classes.root}
        noValidate
        autoComplete="off"
        onSubmit={addNewTaskHandler(dataGlobal.activeBoard.id, data.status)}
      >
        <CardContent>
          <Box>
            <TextField id="title" label="Title" onInput={titleHandler} />
          </Box>
          <Box>
            <TextField
              onInput={descriptionHandler}
              id="description"
              label="Fancy description"
              multiline
              rowsMax={4}
            />
          </Box>
        </CardContent>
        
        <CardActions>
          <Button size="small" type="submit" variant="contained" color="secondary">
             Create
          </Button>
          <Button size="small" onClick={() => setIsDraft(false)}>
            Discard
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
