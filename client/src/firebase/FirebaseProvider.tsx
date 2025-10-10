import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from './firebase';
import React, { useEffect, useState } from 'react';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);

  useEffect(() => {
    const enablePersistence = async () => {
      try {
        await enableMultiTabIndexedDbPersistence(db);
        setPersistenceEnabled(true);
      } catch (err) {
        if (err.code == 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code == 'unimplemented') {
          console.warn('The current browser does not support all of the features required to enable persistence.');
        }
        // It's okay to continue without persistence.
        setPersistenceEnabled(true); 
      }
    };

    enablePersistence();
  }, []);

  if (!persistenceEnabled) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
