import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import {
  auth,
  db,
  isFirebaseAdminUser,
  signInWithGoogle,
  signOutUser,
} from '../firebase';

interface FirebaseContextValue {
  user: User | null;
  isAuthReady: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signIn: () => Promise<User | null>;
  logout: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthReady(true);

      if (firebaseUser && isFirebaseAdminUser(firebaseUser)) {
        try {
          const adminRef = doc(db, 'admins', firebaseUser.uid);
          const snap = await getDoc(adminRef);
          if (!snap.exists()) {
            await setDoc(adminRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              role: 'superadmin',
              createdAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error('Admin record sync skipped:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (): Promise<User | null> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const signedInUser = await signInWithGoogle();
      return signedInUser;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google Sign-In failed.';
      setAuthError(message);
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signOutUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-out failed.';
      setAuthError(message);
    } finally {
      setAuthLoading(false);
    }
  };

  const isAdmin = isFirebaseAdminUser(user);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        isAuthReady,
        isAdmin,
        authLoading,
        authError,
        clearAuthError: () => setAuthError(null),
        signIn,
        logout,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export function useFirebase(): FirebaseContextValue {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error('useFirebase must be used inside a FirebaseProvider');
  }
  return ctx;
}
