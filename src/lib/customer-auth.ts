import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type Unsubscribe,
  type User,
} from "firebase/auth";

export type CustomerSession = {
  uid: string;
  email: string;
  emailVerified: boolean;
  idToken: string;
};

function getFirebaseApp(): FirebaseApp {
  if (getApps().length > 0) return getApp();

  const projectId = import.meta.env["VITE_FIREBASE_PROJECT_ID"]?.trim();
  const apiKey = import.meta.env["VITE_FIREBASE_API_KEY"]?.trim();
  if (!projectId || !apiKey) {
    throw new Error("Firebase authentication is not configured.");
  }

  return initializeApp({
    apiKey,
    authDomain: projectId + ".firebaseapp.com",
    projectId,
  });
}

let authPromise: Promise<Auth> | null = null;

export async function getCustomerAuth(): Promise<Auth> {
  if (typeof window === "undefined") {
    throw new Error("Authentication is only available in the browser.");
  }
  if (!authPromise) {
    const auth = getAuth(getFirebaseApp());
    authPromise = setPersistence(auth, browserLocalPersistence).then(async () => {
      await auth.authStateReady();
      return auth;
    });
  }
  return authPromise;
}

export async function subscribeToCustomerAuth(
  listener: (user: User | null) => void,
): Promise<Unsubscribe> {
  const auth = await getCustomerAuth();
  return onAuthStateChanged(auth, listener);
}

export async function getCurrentCustomerSession(): Promise<CustomerSession | null> {
  const auth = await getCustomerAuth();
  await auth.authStateReady();
  const user = auth.currentUser;
  if (!user) return null;

  const token = await user.getIdToken();
  return {
    uid: user.uid,
    email: user.email?.trim().toLowerCase() ?? "",
    emailVerified: user.emailVerified,
    idToken: token,
  };
}

export async function registerCustomer(email: string, password: string) {
  const auth = await getCustomerAuth();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await sendEmailVerification(credential.user).catch(() => undefined);
  return credential;
}

export async function loginCustomer(email: string, password: string) {
  const auth = await getCustomerAuth();
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function loginCustomerWithGoogle() {
  const auth = await getCustomerAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function resendCustomerVerification() {
  const auth = await getCustomerAuth();
  if (!auth.currentUser) throw new Error("Sign in before requesting email verification.");
  await sendEmailVerification(auth.currentUser);
}

export async function resetCustomerPassword(email: string) {
  const normalized = email.trim();
  if (!normalized) throw new Error("Enter your email address first.");
  const auth = await getCustomerAuth();
  await sendPasswordResetEmail(auth, normalized);
}

export async function logoutCustomer() {
  const auth = await getCustomerAuth();
  await signOut(auth);
}

export function customerAuthError(error: unknown) {
  const code = error instanceof Error && "code" in error ? String(error.code) : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";
    case "auth/invalid-credential":
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email or password is incorrect.";
    case "auth/weak-password":
      return "Use a password with at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication.";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled in Firebase yet.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";
    default:
      return error instanceof Error ? error.message : "Authentication failed.";
  }
}
