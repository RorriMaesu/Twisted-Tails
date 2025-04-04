import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWhcuKOqm7b60vod16s1hEQP6qqzNE3Ew",
  authDomain: "twisted-tails.firebaseapp.com",
  databaseURL: "https://twisted-tails-default-rtdb.firebaseio.com",
  projectId: "twisted-tails",
  storageBucket: "twisted-tails.firebasestorage.app",
  messagingSenderId: "621468825130",
  appId: "1:621468825130:web:5ecfafbeb67f472922f553",
  measurementId: "G-6P2QFMMK17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
