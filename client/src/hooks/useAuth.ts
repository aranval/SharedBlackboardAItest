import { useState, useEffect } from "react";
import { 
  signInWithRedirect, 
  signInAnonymously,
  getRedirectResult, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for redirect result on mount
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          console.log('Sign-in successful:', result.user);
        }
      })
      .catch((error) => {
        console.error('Sign-in error:', error);
      });

    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Provide helpful error messages
      if (error?.code === 'auth/unauthorized-domain') {
        const helpfulError = new Error(
          'Domain not authorized. Please add your domain to Firebase Console → Authentication → Settings → Authorized domains'
        );
        helpfulError.name = 'UnauthorizedDomainError';
        throw helpfulError;
      }
      
      throw error;
    }
  };

  const signInAnonymouslyUser = async () => {
    try {
      const result = await signInAnonymously(auth);
      return result.user;
    } catch (error: any) {
      console.error('Error signing in anonymously:', error);
      
      // Provide helpful error messages
      if (error?.code === 'auth/admin-restricted-operation') {
        const helpfulError = new Error(
          'Anonymous authentication is disabled. Please enable it in Firebase Console → Authentication → Sign-in method → Anonymous'
        );
        helpfulError.name = 'AnonymousAuthDisabledError';
        throw helpfulError;
      }
      
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signInAnonymouslyUser,
    signOut,
  };
}
