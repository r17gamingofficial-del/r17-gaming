import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCt_iI7VSwBMdThnj1CmbyzyUD3ZLmJWYs",
  authDomain: "r17gaming-b8d98.firebaseapp.com",
  projectId: "r17gaming-b8d98",
  storageBucket: "r17gaming-b8d98.firebasestorage.app",
  messagingSenderId: "699196453293",
  appId: "1:699196453293:web:46ab058357e9aff4d57124",
  measurementId: "G-9D9BTPMVR5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
