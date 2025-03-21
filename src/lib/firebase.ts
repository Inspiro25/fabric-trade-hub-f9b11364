import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Your Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyAPlsR1J7WMxWjDjydr2tYMoeMm4fJhL4Y",
  authDomain: "vyomachat.firebaseapp.com",
  projectId: "vyomachat",
  storageBucket: "vyomachat.firebasestorage.app",
  messagingSenderId: "1044834196901",
  appId: "1:1044834196901:web:821e4c734389a6107e9c4c",
  measurementId: "G-WYK98S3BPW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Authentication functions
export const registerWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithEmail = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const loginWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

export const loginWithFacebook = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, facebookProvider);
  return userCredential.user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUserProfile = async (displayName: string, photoURL?: string): Promise<void> => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    await updateProfile(currentUser, {
      displayName,
      photoURL: photoURL || currentUser.photoURL
    });
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export { auth };

// Firestore exports
const db = getFirestore(app);

export { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp
};

// Storage exports
const storage = getStorage(app);
export { storage, ref, uploadBytes, getDownloadURL };
