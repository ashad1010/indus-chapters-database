// UsersPanel.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';

// Role metadata — colors and descriptions for each role
const ROLE_CONFIG = {
  super_admin: { color: '#7c3aed', bg: '#f3f0ff', label: 'Super Admin', icon: '👑' },
  admin:       { color: '#0060af', bg: '#eff6ff', label: 'Admin',       icon: '🛡️' },
  editor:      { color: '#0f7a4a', bg: '#f0fdf4', label: 'Editor',      icon: '✏️' },
  readonly:    { color: '#64748b', bg: '#f1f5f9', label: 'Read Only',   icon: '👁️' },
  pending:     { color: '#b45309', bg: '#fffbeb', label: 'Pending',     icon: '⏳' },
};

function UsersPanel() {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.rpc('get_users_with_emails');

      if (error) {
        console.error('❌ Failed to fetch users:', error.message);
        setLoading(false);
        return;
      }

      setUsers(data);
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

    if (error) {
      alert('❌ Failed to update user');
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user_id ? { ...u, role: newRole, country: newCountry } : u
        )
      );
      setEditingId(null);
      setEditDraft({});
    }
    setUpdatingId(null);
  };

  const startEdit = (user) => {
    setEditingId(user.user_id);
    setEditDraft({ role: user.role, country: user.country || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const allowedRoles = userRole === 'super_admin'
    ? ['super_admin', 'admin', 'editor', 'readonly', 'pending']
    : ['editor', 'readonly'];

  // Unauthorized state
  if (!['admin', 'super_admin'].includes(userRole)) {
    return (
      <div style={unauthorizedStyle}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚫</div>
        <h3 style={{ color: '#0d1b2a', fontWeight: '700', marginBottom: '0.4rem' }}>Access Restricted</h3>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>You need admin or super admin privileges to view this page.</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#64748b', gap: '0.75rem' }}>
        <div style={spinnerStyle} />
        Loading users…
      </div>
    );
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = !searchQuery ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.country || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Stats
  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0d1b2a', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          User Management
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Manage roles and country access for all dashboard users.
        </p>
      </div>

      {/* Stats row */}
      <div style={statsRowStyle}>
        <StatCard label="Total Users" value={users.length} icon="👥" color="#0060af" />
        <StatCard label="Pending Approval" value={roleCounts['pending'] || 0} icon="⏳" color="#b45309" highlight={roleCounts['pending'] > 0} />
        <StatCard label="Admins" value={(roleCounts['admin'] || 0) + (roleCounts['super_admin'] || 0)} icon="🛡️" color="#7c3aed" />
        <StatCard label="Editors" value={roleCounts['editor'] || 0} icon="✏️" color="#0f7a4a" />
        <StatCard label="Read Only" value={roleCounts['readonly'] || 0} icon="👁️" color="#64748b" />
      </div>

      {/* Toolbar */}
      <div style={toolbarStyle}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search by email or country…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={selectStyle}>
          <option value="">All Roles</option>
          {['super_admin', 'admin', 'editor', 'readonly', 'pending'].map((r) => (
            <option key={r} value={r}>{ROLE_CONFIG[r]?.label || r}</option>
          ))}
        </select>

        <div style={{ fontSize: '0.82rem', color: '#64748b', whiteSpace: 'nowrap' }}>
          {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Empty state */}
      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
          <div style={{ fontWeight: '600', color: '#374151' }}>No users found</div>
          <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>Try adjusting your search or filter</div>
        </div>
      )}

      {/* Users table card */}
      {filteredUsers.length > 0 && (
        <div style={tableCardStyle}>
          {/* Table header */}
          <div style={tableHeaderStyle}>
            <div style={{ flex: '2', minWidth: 0 }}>User</div>
            <div style={{ flex: '1' }}>Role</div>
            <div style={{ flex: '1' }}>Country</div>
            <div style={{ flex: '1', textAlign: 'right' }}>Actions</div>
          </div>

          {/* Table rows */}
          {filteredUsers.map((user, index) => {
            const isEditing = editingId === user.user_id;
            const isUpdating = updatingId === user.user_id;
            const roleConf = ROLE_CONFIG[user.role] || ROLE_CONFIG['readonly'];

            return (
              <div
                key={user.user_id}
                style={{
                  ...tableRowStyle,
                  background: isEditing ? '#f0f7ff' : index % 2 === 0 ? 'white' : '#fafbfc',
                  borderLeft: isEditing ? '3px solid #0060af' : '3px solid transparent',
                }}
              >
                {/* User email */}
                <div style={{ flex: '2', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={userAvatarStyle}>
                      {(user.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        fontWeight: '500',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {user.email || '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div style={{ flex: '1' }}>
                  {isEditing ? (
                    <select
                      value={editDraft.role}
                      onChange={(e) => setEditDraft(prev => ({ ...prev, role: e.target.value }))}
                      style={inlineSelectStyle}
                    >
                      {allowedRoles.map((role) => (
                        <option key={role} value={role}>{ROLE_CONFIG[role]?.label || role}</option>
                      ))}
                    </select>
                  ) : (
                    <RoleBadge role={user.role} />
                  )}
                </div>

                {/* Country */}
                <div style={{ flex: '1' }}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editDraft.country}
                      onChange={(e) => setEditDraft(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="e.g. Canada"
                      style={inlineInputStyle}
                    />
                  ) : (
                    <span style={{ fontSize: '0.875rem', color: user.country ? '#374151' : '#94a3b8' }}>
                      {user.country || '—'}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', alignItems: 'center' }}>
                  {isUpdating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem' }}>
                      <div style={{ ...spinnerStyle, width: '14px', height: '14px', borderWidth: '2px' }} />
                      Saving…
                    </div>
                  ) : isEditing ? (
                    <>
                      <button
                        onClick={cancelEdit}
                        style={cancelBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(user.user_id, editDraft.role, editDraft.country)}
                        style={saveBtnStyle}
                        onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
                        onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(user)}
                      style={editBtnStyle}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#0060af';
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#0060af';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'white';
                        e.currentTarget.style.color = '#0060af';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                      }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Roles legend */}
      <div style={legendCardStyle}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.75rem' }}>
          Role Permissions
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {Object.entries(ROLE_CONFIG).map(([key, conf]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#374151' }}>
              <span style={{ ...roleBadgeBase, color: conf.color, background: conf.bg, fontSize: '0.72rem' }}>
                {conf.icon} {conf.label}
              </span>
              <span style={{ color: '#94a3b8' }}>
                {key === 'super_admin' ? '— Full access + user management' :
                 key === 'admin'       ? '— Manage chapters + users' :
                 key === 'editor'      ? '— Add/edit chapters in their country' :
                 key === 'readonly'    ? '— View chapters only' :
                                        '— Awaiting role assignment'}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── Helper components ─────────────────────────────────

function RoleBadge({ role }) {
  const conf = ROLE_CONFIG[role] || ROLE_CONFIG['readonly'];
  return (
    <span style={{ ...roleBadgeBase, color: conf.color, background: conf.bg }}>
      {conf.icon} {conf.label}
    </span>
  );
}

function StatCard({ label, value, icon, color, highlight }) {
  return (
    <div style={{
      flex: 1,
      background: highlight ? '#fffbeb' : 'white',
      border: `1px solid ${highlight ? '#fde68a' : '#e8edf2'}`,
      borderRadius: '10px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: `${color}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '1.4rem', fontWeight: '800', color: highlight ? '#b45309' : '#0d1b2a', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem', fontWeight: '500' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────

const statsRowStyle = {
  display: 'flex',
  gap: '0.875rem',
  marginBottom: '1.25rem',
  flexWrap: 'wrap',
};

const toolbarStyle = {
  display: 'flex',
  gap: '0.75rem',
  marginBottom: '1rem',
  alignItems: 'center',
  background: 'white',
  padding: '0.875rem 1rem',
  borderRadius: '10px',
  border: '1px solid #e8edf2',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  flexWrap: 'wrap',
};

const searchInputStyle = {
  width: '100%',
  padding: '0.55rem 0.75rem 0.55rem 2.1rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  fontSize: '0.875rem',
  color: '#1e293b',
  outline: 'none',
  background: '#f8fafc',
  boxSizing: 'border-box',
};

const selectStyle = {
  padding: '0.55rem 0.75rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  fontSize: '0.85rem',
  color: '#374151',
  background: '#f8fafc',
  outline: 'none',
  cursor: 'pointer',
};

const tableCardStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: '1.25rem',
};

const tableHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.75rem 1.25rem',
  background: '#f8fafc',
  borderBottom: '1px solid #e8edf2',
  fontSize: '0.72rem',
  fontWeight: '700',
  color: '#94a3b8',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  gap: '1rem',
};

const tableRowStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.875rem 1.25rem',
  borderBottom: '1px solid #e8edf2',
  gap: '1rem',
  transition: 'background 0.1s',
};

const userAvatarStyle = {
  width: '32px', height: '32px', borderRadius: '8px',
  background: 'linear-gradient(135deg, #0060af, #003f75)',
  color: 'white', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontWeight: '700',
  fontSize: '0.8rem', flexShrink: 0,
};

const roleBadgeBase = {
  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
  padding: '0.25rem 0.65rem', borderRadius: '20px',
  fontSize: '0.78rem', fontWeight: '600',
};

const inlineSelectStyle = {
  padding: '0.45rem 0.65rem',
  borderRadius: '7px',
  border: '1.5px solid #bfdbfe',
  fontSize: '0.85rem',
  color: '#1e293b',
  background: 'white',
  outline: 'none',
  cursor: 'pointer',
};

const inlineInputStyle = {
  width: '100%',
  maxWidth: '160px',
  padding: '0.45rem 0.65rem',
  borderRadius: '7px',
  border: '1.5px solid #bfdbfe',
  fontSize: '0.85rem',
  color: '#1e293b',
  background: 'white',
  outline: 'none',
  boxSizing: 'border-box',
};

const editBtnStyle = {
  padding: '0.38rem 0.9rem',
  background: 'white',
  color: '#0060af',
  border: '1.5px solid #bfdbfe',
  borderRadius: '7px',
  fontWeight: '600',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'all 0.15s',
};

const saveBtnStyle = {
  padding: '0.38rem 0.9rem',
  background: '#0060af',
  color: 'white',
  border: 'none',
  borderRadius: '7px',
  fontWeight: '600',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const cancelBtnStyle = {
  padding: '0.38rem 0.75rem',
  background: 'white',
  color: '#64748b',
  border: '1.5px solid #e2e8f0',
  borderRadius: '7px',
  fontWeight: '500',
  fontSize: '0.8rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const legendCardStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
  padding: '1.1rem 1.25rem',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const spinnerStyle = {
  width: '18px', height: '18px',
  border: '2px solid #e2e8f0',
  borderTop: '2px solid #0060af',
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
  flexShrink: 0,
};

const unauthorizedStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
};

export default UsersPanel;