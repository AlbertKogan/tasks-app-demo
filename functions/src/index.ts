import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const processCount = (type: "add" | "remove") =>
  (_: unknown, context: functions.EventContext) => {
    const boardToUpdate = db.doc(`/boards/${context.params.boardId}`);

    return db
        .runTransaction((transaction) => {
          return transaction.get(boardToUpdate).then((boardDoc) => {
            if (!boardDoc.exists) {
              throw new Error("Document does not exist!");
            }

            const data = boardDoc.data();
            const count = data?.taskCount || 0;
            
            if (type === "remove" && !count) {
              throw new Error("Fail to decrease task amount");
            }

            transaction.update(boardToUpdate, {
              taskCount: type === "add" ? count + 1 : count - 1,
            });
          });
        })
        .then(() => {
          console.log("Transaction successfully committed!");
        })
        .catch((error) => {
          console.log("Transaction failed: ", error);
        });
  };

export const incrementBoardCount = functions
    .firestore
    .document("/boards/{boardId}/tasks/{taskId}")
    .onCreate(processCount("add"));

export const decrementBoardCount = functions
    .firestore
    .document("/boards/{boardId}/tasks/{taskId}")
    .onDelete(processCount("remove"));
