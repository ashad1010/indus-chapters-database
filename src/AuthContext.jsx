// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Create the global auth context
const AuthContext = createContext();

// AuthProvider wraps around your app and shares user info
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // holds full user object
  const [userRole, setUserRole] = useState(null); // new: tracks 'admin' or 'user'

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setUserRole(user?.user_metadata?.role || null); // pull role from metadata
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setUserRole(currentUser?.user_metadata?.role || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use in components
export const useAuth = () => useContext(AuthContext);
