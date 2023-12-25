// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvx-bLZhAlP2wRcihqx5XrKwfRb6AbdOA",
  authDomain: "chatnow-8edee.firebaseapp.com",
  projectId: "chatnow-8edee",
  storageBucket: "chatnow-8edee.appspot.com",
  messagingSenderId: "1002583201575",
  appId: "1:1002583201575:web:782aab1ebb1f8f5760bb02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provide = new GoogleAuthProvider();