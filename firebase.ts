import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyDsqd9HszE_x-1ifUuJLanui9iLtgveuXc",
    authDomain: "devconnect-8bfb5.firebaseapp.com",
    projectId: "devconnect-8bfb5",
    storageBucket: "devconnect-8bfb5.firebasestorage.app",
    messagingSenderId: "1080502293124",
    appId: "1:1080502293124:web:a508a8c03a57d300f2e8d1"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore(app);

  export { db };