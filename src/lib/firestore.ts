import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observer, Status, Board, Task } from '../interfaces';

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
}
const APP_NAME = 'KANBAN_APP';

let store: firebase.firestore.Firestore;
let app: firebase.app.App;

if (!firebase.apps.length) {
  app = firebase.initializeApp(FIREBASE_CONFIG, APP_NAME);
  store = app.firestore();
  if (process.env.NODE_ENV === 'development') {
    // populate local firestore 
    store.useEmulator("localhost", 5002);

    getBoardsData().then((data) => {
      if (!data.length) {
        const statuses = [
          { id: 'candidates', displayName: 'Candidates', order: 0 },
          { id: 'progress', displayName: 'In Progress', order: 1 },
          { id: 'qa', displayName: 'QA', order: 2 },
          { id: 'completed', displayName: 'Completed', order: 3 },
        ];
    
        const board = { displayName: 'R&D', isActive: true, taskCount: 0 };
        
        store.collection('/boards').doc('rnd').set(board);
        statuses.map((status) => store.collection('/statuses').doc(status.id).set(status));
      }
    });
  }
} else {
  app =firebase.app(APP_NAME);
  store = app.firestore();
} 

async function getStatusData() {
  const statusesResponse = await store
    .collection('statuses')
    .orderBy('order', 'asc')
    .get();
  const statusesData: Status[] = [];

  statusesResponse.forEach((doc) => {
    statusesData.push({
      id: doc.id,
      ...doc.data(),
    } as Status);
  });
  return statusesData;
}

async function getBoardsData() {
  const boards = await store.collection('boards').get();
  const boardsData: Board[] = [];

  boards.forEach((doc) =>
    boardsData.push({ id: doc.id, ...doc.data() } as Board)
  );
  return boardsData;
}

export async function getData(): Promise<{
  statusesData: Status[];
  boardsData: Board[];
  activeBoard: Board;
}> {
  const statusesData = await getStatusData();
  const boardsData = await getBoardsData();
  const activeBoard = boardsData.find((board) => board.isActive)!;

  return {
    statusesData,
    boardsData,
    activeBoard,
  };
}

export async function addNewTask(boardId: string, task: Partial<Task>) {
  return store
    .collection('boards')
    .doc(boardId)
    .collection('tasks')
    .add({
      ...task,
      created: firebase.firestore.Timestamp.now(),
      updated: firebase.firestore.Timestamp.now(),
    });
}

export async function updateTask(
  boardId: string,
  taskId: string,
  data: Partial<Task>
) {
  const taskToUpdate = store
    .collection('boards')
    .doc(boardId)
    .collection('tasks')
    .doc(taskId);
  return store
    .runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(taskToUpdate).then((taskDoc) => {
        if (!taskDoc.exists) {
          throw new Error('Document does not exist!');
        }
        transaction.update(taskToUpdate, {
          ...data,
          updated: firebase.firestore.Timestamp.now(),
        });
      });
    })
    .then(() => {
      console.log('Transaction successfully committed!');
    })
    .catch((error) => {
      console.log('Transaction failed: ', error);
    });
}

export async function deleteTask(boardId: string, taskId: string) {
  const taskToDelete = store
    .collection('boards')
    .doc(boardId)
    .collection('tasks')
    .doc(taskId);
  return store
    .runTransaction((transaction) => {
      // This code may get re-run multiple times if there are conflicts.
      return transaction.get(taskToDelete).then((taskDoc) => {
        if (!taskDoc.exists) {
          throw new Error('Document does not exist!');
        }
        transaction.delete(taskToDelete);
      });
    })
    .then(() => {
      console.log('Transaction successfully committed!');
    })
    .catch((error) => {
      console.log('Transaction failed: ', error);
    });
}

export const streamTasks = (boardId: string, observer: Observer) => {
  return store
    .collection('boards')
    .doc(boardId)
    .collection('tasks')
    .onSnapshot(observer);
};

export const streamBoardCount = (boardId: string, observer: Observer) => {
  return store
    .collection('boards')
    .doc(boardId)
    .onSnapshot(observer);
};

export default store;
