// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE,
  authDomain: "rp-autograder.firebaseapp.com",
  projectId: "rp-autograder",
  storageBucket: "rp-autograder.appspot.com",
  messagingSenderId: "343824644822",
  appId: "1:343824644822:web:878f8baba86f751aa9a777",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
