import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGj86Szo4Ax0qtamwMOLCiVMCh9esMlOE",
  authDomain: "react-chat-5803a.firebaseapp.com",
  projectId: "react-chat-5803a",
  databaseURL: "https://react-chat-5803a-default-rtdb.firebaseio.com",
  storageBucket: "react-chat-5803a.appspot.com",
  messagingSenderId: "799934128495",
  appId: "1:799934128495:web:b722ddd7b8689b9828489a",
  measurementId: "G-V8NBMNSY0Q",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
