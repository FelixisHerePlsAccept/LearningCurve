import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "thisismybookmark-773b5.firebaseapp.com",
  projectId: "thisismybookmark-773b5",
  storageBucket: "thisismybookmark-773b5.appspot.com",
  messagingSenderId: "209030945450",
  appId: "1:209030945450:web:d3900e3845f9fc4ef00ed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
