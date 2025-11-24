// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/');
  };

  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '2rem'
  };

  const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '100%'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const buttonStyle = {
    width: '100%',
    background: '#0060af',
    color: 'white',
    border: 'none',
    padding: '0.6rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const headingStyle = {
    color: '#0060af',
    marginBottom: '1.5rem',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Login to Indus Dashboard</h2>
        <form onSubmit={handleLogin}>
          <label style={{ fontWeight: 'bold', color: '#222' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={{ fontWeight: 'bold', color: '#222' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>Login</button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;