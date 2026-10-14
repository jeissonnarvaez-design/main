import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore  } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBaFPxk7TRw0800qXOXNDIJ5ldtri4V1aQ",
  authDomain: "gestor-archivos-e96ea.firebaseapp.com",
  databaseURL: "https://gestor-archivos-e96ea-default-rtdb.firebaseio.com",
  projectId: "gestor-archivos-e96ea",
  storageBucket: "gestor-archivos-e96ea.firebasestorage.app",
  messagingSenderId: "349765687515",
  appId: "1:349765687515:web:2ca73bc46cdc25ea1d14fe",
  measurementId: "G-06XTNR1PEB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true
});