// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA4oJlY3RbdX-jr0k6gk-vN8C-cwnU8958",
  authDomain: "proyecto1-d6832.firebaseapp.com",
  databaseURL: "https://proyecto1-d6832-default-rtdb.firebaseio.com",
  projectId: "proyecto1-d6832",
  storageBucket: "proyecto1-d6832.firebasestorage.app",
  messagingSenderId: "200318064819",
  appId: "1:200318064819:web:ac7f4641954a839a87b8c6",
  measurementId: "G-4PRXFHVSQ6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };