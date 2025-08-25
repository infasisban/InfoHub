import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCfIKzvimVKXYu3frU0KcGXh0qLp8Wntvw",
    authDomain: "infohubweb.firebaseapp.com",
    projectId: "infohubweb",
    storageBucket: "infohubweb.firebasestorage.app",
    messagingSenderId: "587872744613",
    appId: "appId: 1:587872744613:web:ab73835b91c12f7152894c",
    measurementId: "G-HB46L3N001",
};

const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app);
export default app;
