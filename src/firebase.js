import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCfIKzvimVKXYu3frU0KcGXh0qLp8Wntvw",
    authDomain: "infohubweb.firebaseapp.com",
    projectId: "infohubweb",
    storageBucket: "infohubweb.appspot.com",
    messagingSenderId: "587872744613",
    appId: "1:587872744613:web:ab73835b91c12f7152894c",
    measurementId: "G-HB46L3N001",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

console.log("Firebase App Initialized:", app);

export { app, db };
