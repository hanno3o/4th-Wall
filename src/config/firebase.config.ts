import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDZhD7YszpOnciQlkpbfg-8YNrCSvVWVZk',
  authDomain: 'thwall-d0123.firebaseapp.com',
  projectId: 'thwall-d0123',
  storageBucket: 'thwall-d0123.appspot.com',
  messagingSenderId: '101328089567',
  appId: '1:101328089567:web:0ed5b49d63de6200ee546a',
  measurementId: 'G-YWCVCT0VYF',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;
