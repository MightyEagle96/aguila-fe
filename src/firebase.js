import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD31BPqFEHoo65czf27nobJBaUuK0Tn3Bs",
  authDomain: "aguila7.firebaseapp.com",
  projectId: "aguila7",
  storageBucket: "aguila7.appspot.com",
  messagingSenderId: "745647301619",
  appId: "1:745647301619:web:921041e52d6c9a8ad0e886",
  measurementId: "G-40T90DBST1",
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
