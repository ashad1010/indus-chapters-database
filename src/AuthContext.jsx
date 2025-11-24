import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("❌ Auth error:", authError);
      }

      console.log("👤 Supabase returned user:", currentUser);
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role, country')
          .eq('user_id', currentUser.id)
          .single();

        if (error) {
          console.error("❌ Role fetch error:", error.message);
        } else {
          console.log("✅ Fetched role:", data.role, "| Country:", data.country);
          setUserRole(data.role);
          setUserCountry(data.country);
        }
      }

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      console.log("🔄 Auth state change - user:", currentUser);
      setUser(currentUser);

      if (currentUser) {
        supabase
          .from('user_roles')
          .select('role, country')
          .eq('user_id', currentUser.id)
          .single()
          .then(({ data }) => {
            console.log("🔁 Fetched from listener:", data);
            setUserRole(data?.role || null);
            setUserCountry(data?.country || null);
          });
      } else {
        setUserRole(null);
        setUserCountry(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>⏳ Loading context...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userRole, userCountry, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
