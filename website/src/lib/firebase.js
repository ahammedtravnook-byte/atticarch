import { initializeApp, deleteApp } from 'firebase/app'
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
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
}

export const COL = {
  projects: 'projects',
  heroSlides: 'heroSlides',
  heroSettings: 'heroSettings',
}

/**
 * Create a new Firebase Auth user WITHOUT signing out the current admin.
 *
 * The client SDK's createUserWithEmailAndPassword() auto-signs-in as the new
 * user on the default app instance — which would log the admin out. To avoid
 * that, we spin up a throwaway secondary app, create the user there, then sign
 * out and tear it down. The current admin session on the default app is left
 * completely untouched.
 */
export async function createAuthUser(emailAddr, password) {
  const secondary = initializeApp(firebaseConfig, `user-creator-${emailAddr}`)
  const secondaryAuth = getAuth(secondary)
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, emailAddr, password)
    return cred.user
  } finally {
    try { await signOut(secondaryAuth) } catch { /* ignore */ }
    try { await deleteApp(secondary) } catch { /* ignore */ }
  }
}
