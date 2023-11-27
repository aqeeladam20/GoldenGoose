import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


// Create a context
const UserContext = createContext<any | null>(null);

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  // Use useEffect to fetch user details when authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser: any) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', authUser.uid));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []); // Only run on mount and unmount

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

// Create a hook to use the user context
export const useUser = () => {
  const user = useContext(UserContext);
  return user;
};
