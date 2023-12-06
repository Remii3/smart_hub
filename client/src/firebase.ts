import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBD8cQ1b4EVn6s3plgH-05DI6gn3WD5oNg',
  authDomain: 'smarthub-75eab.firebaseapp.com',
  projectId: 'smarthub-75eab',
  storageBucket: 'smarthub-75eab.appspot.com',
  messagingSenderId: '202667669588',
  appId: '1:202667669588:web:62c880f10f58ed8c4d15c1',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
