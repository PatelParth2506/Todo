import { initializeApp } from "firebase/app";
import { 
  GoogleAuthProvider,
  getAuth, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  applyActionCode
} from "firebase/auth";

import { signupWithGoogles } from "./authService";

const firebaseConfig = {
  apiKey: "AIzaSyCcW8NDRyUfMXfEZRp9vizXoYQ6-5x_iiY",
  authDomain: "test-auth-4ea84.firebaseapp.com",
  projectId: "test-auth-4ea84",
  storageBucket: "test-auth-4ea84.firebasestorage.app",
  messagingSenderId: "801643383035",
  appId: "1:801643383035:web:d10f529e6f7cc2ef03c85e",
  measurementId: "G-C2RE606JG1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signupWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        const response = await signupWithGoogles(idToken);
        return response;
    } catch (error) {
        console.log("Google sign-in failed:", error);
        alert(error.message);
        return null;
    }
}

export async function registerWithEmail(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user)
        return userCredential.user;
    } catch (error) {
        console.error("Email registration failed:", error);
        alert(error.message);
        return null;
    }
}

export async function verifyEmailAction(actionCode) {
  try {
    await applyActionCode(auth, actionCode);
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(true);
      return idToken; 
    }
    return null;
  } catch (error) {
    console.error("Email verification failed:", error);
    alert(error.message);
    return null;
  }
}
