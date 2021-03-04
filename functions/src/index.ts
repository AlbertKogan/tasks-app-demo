import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions
  .firestore
  .document('/boards/rnd/tasks')
  .onWrite((change, context) => {
      console.log(change, context);
  });
