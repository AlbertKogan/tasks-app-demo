import firebase from 'firebase/app';
import { Observer, Status, Board, Task } from '../interfaces';
export default class Store {
  store: firebase.firestore.Firestore;
  app: firebase.app.App;

  constructor (init: any, config: any, appName?: string) {
    let app: firebase.app.App;

    if (!firebase.apps.length) {
      app = init(config, appName);
    } else {
      app =firebase.app(appName);
    }
    

    this.store = app.firestore();
    this.app = app;
  }

  populateData() {
    return this.getBoardsData().then((data) => {
      if (!data.length) {
        const statuses = [
          { id: 'candidates', displayName: 'Candidates', order: 0 },
          { id: 'progress', displayName: 'In Progress', order: 1 },
          { id: 'qa', displayName: 'QA', order: 2 },
          { id: 'completed', displayName: 'Completed', order: 3 },
        ];
    
        const boards = [
          { id: 'rnd', displayName: 'R&D', isActive: true, taskCount: 0 },
          { id: 'sales', displayName: 'Sales', isActive: false, taskCount: 0 },
        ];
        boards.map((board) => this.store.collection('/boards').doc(board.id).set(board));
        statuses.map((status) => this.store.collection('/statuses').doc(status.id).set(status));
      }
    });
  }

  async getStatusData() {
    const statusesResponse = await this.store
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

  async getBoardsData() {
    const boards = await this.store.collection('boards').get();
    const boardsData: Board[] = [];
  
    boards.forEach((doc) =>
      boardsData.push({ id: doc.id, ...doc.data() } as Board)
    );
    return boardsData;
  }

  async getData(): Promise<{
    statusesData: Status[];
    boardsData: Board[];
    activeBoard: Board;
  }> {
    const statusesData = await this.getStatusData();
    const boardsData = await this.getBoardsData();
    const activeBoard = boardsData.find((board) => board.isActive)!;
  
    return {
      statusesData,
      boardsData,
      activeBoard,
    };
  }

  async addNewTask(boardId: string, task: Partial<Task>) {
    return this.store
      .collection('boards')
      .doc(boardId)
      .collection('tasks')
      .add({
        ...task,
        created: firebase.firestore.Timestamp.now(),
        updated: firebase.firestore.Timestamp.now(),
      });
  }

  async updateTask(
    boardId: string,
    taskId: string,
    data: Partial<Task>
  ) {
    const taskToUpdate = this.store
      .collection('boards')
      .doc(boardId)
      .collection('tasks')
      .doc(taskId);
    return this.store
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
  async deleteTask(boardId: string, taskId: string) {
    const taskToDelete = this.store
      .collection('boards')
      .doc(boardId)
      .collection('tasks')
      .doc(taskId);
    return this.store
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

  streamTasks(boardId: string, observer: Observer) {
    return this.store
      .collection('boards')
      .doc(boardId)
      .collection('tasks')
      .onSnapshot(observer);
  };

  streamBoardCount(boardId: string, observer: Observer) {
    return this.store
      .collection('boards')
      .doc(boardId)
      .onSnapshot(observer);
  };
}
