import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.React_APP_apiKey,
  authDomain: process.env.React_APP_authDomain,
  projectId: process.env.React_APP_projectId,
  storageBucket: process.env.React_APP_storageBucket,
  messagingSenderId: process.env.React_APP_messagingSenderId,
  appId: process.env.React_APP_appId,
  measurementId: process.env.React_APP_measurementId,
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account ",
});
export const googleProvider = () => signInWithPopup(auth, provider);
export const auth = getAuth(app);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
export const db = getFirestore(app);
