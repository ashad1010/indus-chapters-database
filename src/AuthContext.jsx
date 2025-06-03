// AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

// Create a context to store the user
const AuthContext = createContext();

// Provider to wrap around the App
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // state to hold the current user

  // Fetch the currently logged-in user on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    // Listen to login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    // Cleanup listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy usage
export const useAuth = () => useContext(AuthContext);
