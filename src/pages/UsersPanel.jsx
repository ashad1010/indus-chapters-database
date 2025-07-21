// ✅ SIMPLIFIED VERSION: UsersPanel.jsx (shows user_id only with debug logs)
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

function UsersPanel() {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, country');

      console.log("Fetched roles:", rolesData);

      if (rolesError) {
        console.error('❌ Failed to fetch user roles:', rolesError.message);
        setLoading(false);
        return;
      }

      setUsers(rolesData);
      setLoading(false);
    };

    if (userRole === 'admin' || userRole === 'super_admin') {
      fetchUsers();
    }
  }, [userRole]);

  const handleUpdate = async (user_id, newRole, newCountry) => {
    setUpdatingId(user_id);
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole, country: newCountry })
      .eq('user_id', user_id);

    if (error) alert('❌ Failed to update user');
    else {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user_id ? { ...u, role: newRole, country: newCountry } : u
        )
      );
    }
    setUpdatingId(null);
  };

  const allowedRoles = userRole === 'super_admin'
    ? ['super_admin', 'admin', 'editor', 'readonly', 'pending']
    : ['editor', 'readonly'];

  if (!['admin', 'super_admin'].includes(userRole)) return <p>🚫 You are not authorized to view this page.</p>;

  if (loading) return <p>Loading users...</p>;

  return (
    <div style={{ padding: '2rem', color: '#222' }}>
      <h2 style={{ color: '#0060af' }}>User Role Management</h2>
      <p style={{ marginBottom: '1rem' }}>Only admins and super admins can view this.</p>

      {users.map((user) => (
        <div key={user.user_id} style={{
          border: '1px solid #ccc',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          backgroundColor: '#fff',
          color: '#222'
        }}>
          <strong>User ID:</strong> {user.user_id}<br />

          <label style={{ fontWeight: 'bold' }}>Role:</label>
          <select
            value={user.role}
            onChange={(e) => handleUpdate(user.user_id, e.target.value, user.country)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            {allowedRoles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          <br />

          <label style={{ fontWeight: 'bold' }}>Country:</label>
          <input
            type="text"
            value={user.country}
            onChange={(e) => handleUpdate(user.user_id, user.role, e.target.value)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem', width: '200px' }}
          />

          {updatingId === user.user_id && <p>⏳ Updating...</p>}
        </div>
      ))}
    </div>
  );
}

export default UsersPanel;