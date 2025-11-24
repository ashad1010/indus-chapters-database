// Home.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import bgImage from '../assets/IHNglobal.jpg';

function Home() {
  const { session } = useAuth();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      const email = data?.session?.user?.email;
      if (email) setUserEmail(email);
    };
    if (!session?.user?.email) {
      fetchSession();
    } else {
      setUserEmail(session.user.email);
    }
  }, [session]);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      overflow: 'hidden'
    }}>
      {/* Background Image Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.5,
        zIndex: 0
      }} />

      {/* Foreground Card */}
      <div style={{
        position: 'relative',
        background: 'white',
        padding: '2rem',
        paddingBottom: '2.5rem',
        borderRadius: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        minHeight: '150px'
      }}>
        <h2 style={{ color: '#0060af', marginBottom: '1rem' }}>Welcome to Indus Chapter Dashboard</h2>
        <p style={{ marginBottom: '1rem', color: '#333' }}>Use the buttons in the top right to navigate.</p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          {userEmail ? `🔐 Logged in as: ${userEmail}` : '🔒 Logged Out'}
        </p>
      </div>
    </div>
  );
}

export default Home;