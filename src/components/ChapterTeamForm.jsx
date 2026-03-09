// ChapterTeamForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterTeamForm({ onUpdate }) {
  const [teamMembers, setTeamMembers] = useState([]);

  const addNewMember = () => {
    if (teamMembers.length >= 15) return;
    setTeamMembers([...teamMembers, { name: '', role: '', phone: '', email: '', title: '', note: '', status: '' }]);
  };

  const removeMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  useEffect(() => {
    onUpdate(teamMembers);
  }, [teamMembers, onUpdate]);

  return (
    <div>
      {/* Add button + count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          {teamMembers.length === 0 ? 'No members added yet.' : `${teamMembers.length} member${teamMembers.length !== 1 ? 's' : ''} added`}
        </span>
        <button
          type="button"
          onClick={addNewMember}
          disabled={teamMembers.length >= 15}
          style={{ ...addBtnStyle, opacity: teamMembers.length >= 15 ? 0.5 : 1 }}
          onMouseEnter={e => { if (teamMembers.length < 15) e.currentTarget.style.background = '#004f91'; }}
          onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
        >
          + Add Member
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {teamMembers.map((member, index) => (
          <div key={index} style={memberCardStyle}>
            {/* Member card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8edf2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={avatarStyle}>{index + 1}</div>
                <span style={{ fontWeight: '600', color: '#0d1b2a', fontSize: '0.92rem' }}>
                  {member.name || `Member ${index + 1}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeMember(index)}
                style={removeBtnStyle}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                Remove
              </button>
            </div>

            {/* Fields: 2-col grid */}
            <div style={twoColGrid}>
              <Field label="Full Name" required>
                <input type="text" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} placeholder="e.g. Ahmed Khan" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Role">
                <input type="text" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} placeholder="e.g. Chapter Lead" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Title">
                <input type="text" value={member.title} onChange={(e) => handleMemberChange(index, 'title', e.target.value)} placeholder="e.g. Dr., Eng." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Status">
                <input type="text" value={member.status} onChange={(e) => handleMemberChange(index, 'status', e.target.value)} placeholder="e.g. active" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Phone">
                <input type="text" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} placeholder="e.g. +1 416 000 0000" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Email">
                <input type="email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} placeholder="e.g. ahmed@example.com" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            {/* Note: full width */}
            <div style={{ marginTop: '0.875rem' }}>
              <Field label="Note">
                <input type="text" value={member.note} onChange={(e) => handleMemberChange(index, 'note', e.target.value)} placeholder="Any additional notes about this member..." style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={labelStyle}>
        {label}{required && <span style={{ color: '#dc2626', marginLeft: '0.2rem' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const focusStyle = (e) => e.target.style.borderColor = '#0060af';
const blurStyle = (e) => e.target.style.borderColor = '#e2e8f0';

const twoColGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' };

const labelStyle = { fontSize: '0.82rem', fontWeight: '600', color: '#374151', letterSpacing: '0.01em' };

const inputStyle = {
  width: '100%', padding: '0.65rem 0.85rem', fontSize: '0.92rem',
  borderRadius: '8px', border: '1.5px solid #e2e8f0',
  color: '#1e293b', background: '#fafbfc', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};

const memberCardStyle = {
  background: '#f8fafc', border: '1px solid #e8edf2',
  borderRadius: '10px', padding: '1.1rem',
};

const avatarStyle = {
  width: '28px', height: '28px', borderRadius: '50%',
  background: '#0060af', color: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: '700', fontSize: '0.78rem', flexShrink: 0,
};

const addBtnStyle = {
  padding: '0.5rem 1.1rem', background: '#0060af', color: 'white',
  border: 'none', borderRadius: '8px', fontWeight: '600',
  fontSize: '0.85rem', cursor: 'pointer', transition: 'background 0.15s',
};

const removeBtnStyle = {
  padding: '0.35rem 0.85rem', background: 'white', color: '#dc2626',
  border: '1.5px solid #fecaca', borderRadius: '6px', fontWeight: '600',
  fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s',
};

export default ChapterTeamForm;