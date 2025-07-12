import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDveau0f7k--fHneztfEZkfCINLzLPnRtk",

  authDomain: "skillsswap-8363d.firebaseapp.com",

  projectId: "skillsswap-8363d",

  storageBucket: "skillsswap-8363d.firebasestorage.app",

  messagingSenderId: "842509217293",

  appId: "1:842509217293:web:2d783403852aeec2976f44",

  measurementId: "G-2JDFWHBT92",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
