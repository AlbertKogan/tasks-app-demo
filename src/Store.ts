import firebase from 'firebase/app';
import 'firebase/firestore';

import Store from './lib/firestore';

const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
}
const APP_NAME = 'KANBAN_APP';

const appStore = new Store(
  firebase.initializeApp,
  FIREBASE_CONFIG,
  APP_NAME
)

if (process.env.NODE_ENV === 'development') {
  // populate local firestore 
  appStore.store.useEmulator("localhost", 5002);
  appStore.populateData();
}

export default appStore;