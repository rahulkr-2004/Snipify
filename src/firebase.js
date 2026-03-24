import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Replace with your actual Firebase configuration snippet
// You can get this from the Firebase Console -> Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyCs-ZwA4CLkHXhusyX_7qiVSBHfM36ZRtU",
  authDomain: "snipify-rahul.firebaseapp.com",
  projectId: "snipify-rahul",
  storageBucket: "snipify-rahul.firebasestorage.app",
  messagingSenderId: "35323032953",
  appId: "1:35323032953:web:e9c2ddc33bdb0dbdc26ba8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Set persistence to session (cleared when closing the browser tab)
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
