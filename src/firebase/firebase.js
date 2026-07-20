import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2ZxN3w6xn7WgJtoW1pPvBzGJgLBcpPoI",
  authDomain: "bizpulse-f97ee.firebaseapp.com",
  projectId: "bizpulse-f97ee",
  storageBucket: "bizpulse-f97ee.firebasestorage.app",
  messagingSenderId: "638567635820",
  appId: "1:638567635820:web:90ba948f45c615f135f149",
  measurementId: "G-Y74JGWD62N",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);