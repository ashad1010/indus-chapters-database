// ChapterTeamForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterTeamForm({ onUpdate }) {
  const [teamMembers, setTeamMembers] = useState([]);

  const addNewMember = () => {
    if (teamMembers.length >= 15) return;
    const newMember = {
      name: '',
      role: '',
      phone: '',
      email: '',
      title: '',
      note: '',
      status: '',
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const removeMember = (index) => {
    const updated = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updated);
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  useEffect(() => {
    onUpdate(teamMembers);
  }, [teamMembers, onUpdate]);

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const labelStyle = {
    marginBottom: '0.3rem',
    fontWeight: 'bold',
    color: '#222'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0060af', margin: 0 }}>Chapter Team Members</h3>
        <button type="button" onClick={addNewMember} style={{ background: '#0060af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Add New Member</button>
      </div>

      {teamMembers.map((member, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', background: '#f9f9f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, color:'#222'}}>Member {index + 1}</h4>
            <button type="button" onClick={() => removeMember(index)} style={{ background: '#e01b24', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}>Remove</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center' }}>
            <label style={labelStyle}>Name:</label>
            <input type="text" value={member.name} onChange={(e) => handleMemberChange(index, 'name', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Role:</label>
            <input type="text" value={member.role} onChange={(e) => handleMemberChange(index, 'role', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Phone:</label>
            <input type="text" value={member.phone} onChange={(e) => handleMemberChange(index, 'phone', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Email:</label>
            <input type="email" value={member.email} onChange={(e) => handleMemberChange(index, 'email', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Title:</label>
            <input type="text" value={member.title} onChange={(e) => handleMemberChange(index, 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Note:</label>
            <input type="text" value={member.note} onChange={(e) => handleMemberChange(index, 'note', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Status:</label>
            <input type="text" value={member.status} onChange={(e) => handleMemberChange(index, 'status', e.target.value)} style={inputStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChapterTeamForm;