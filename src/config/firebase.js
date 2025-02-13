// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBRLzu6ZaouAtMZOwkhVvffwe-D1dyGp1Y",
  authDomain: "project02-18a21.firebaseapp.com",
  databaseURL: "https://project02-18a21-default-rtdb.firebaseio.com",
  projectId: "project02-18a21",
  storageBucket: "project02-18a21.firebasestorage.app",
  messagingSenderId: "409905620604",
  appId: "1:409905620604:web:171a86c34e040b8d960bf9",
  measurementId: "G-BF58ETQ0TH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth };