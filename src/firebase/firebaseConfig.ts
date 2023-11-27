// src/firebase/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, sendEmailVerification, User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 



// Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDsmPy9KZeRFjP-prSU-1XvKlhfFThVk_A",
    authDomain: "golden-goose-33360.firebaseapp.com",
    projectId: "golden-goose-33360",
    storageBucket: "golden-goose-33360.appspot.com",
    messagingSenderId: "361133303670",
    appId: "1:361133303670:web:92c7a1bd9d5a2f2509bc57",
    measurementId: "G-QRCXCGNWQ8"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export const sendVerificationEmail = async (user: User) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    console.error('Error sending verification email', error);
    throw error; // Propagate the error for handling in the calling code
  }
};

