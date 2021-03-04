import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observer, Status, Board, Task } from '../interfaces';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
  });
} else {
  firebase.app(process.env.APP_ID);
}

const store = firebase.firestore();

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

async function getBoardData() {
  const activeBoard = await store
    .collection('boards')
    .where('isActive', '==', true)
    .get();
  const boardsData: Board[] = [];

  activeBoard.forEach((doc) => boardsData.push({ id: doc.id }));
  return boardsData[0];
}

export async function getData(): Promise<{
  statusesData: Status[];
  boardData: Board;
}> {
  const statusesData = await getStatusData();
  const boardData = await getBoardData();

  return {
    statusesData,
    boardData,
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

export default store;
