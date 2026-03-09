// ChapterActivitiesForm.jsx
import React, { useState, useEffect } from 'react';

function ChapterActivitiesForm({ onUpdate }) {
  const [activities, setActivities] = useState([]);

  const addNewActivity = () => {
    if (activities.length >= 15) return;
    setActivities([...activities, {
      name: '', date: '', venue: '', ticketPrice: '',
      celebrityGuests: '', capacity: '', attendanceCount: '',
      sponsors: '', fundsCollected: '',
    }]);
  };

  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const removeActivity = (index) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onUpdate(activities);
  }, [activities, onUpdate]);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
          {activities.length === 0 ? 'No events added yet.' : `${activities.length} event${activities.length !== 1 ? 's' : ''} added`}
        </span>
        <button
          type="button"
          onClick={addNewActivity}
          disabled={activities.length >= 15}
          style={{ ...addBtnStyle, opacity: activities.length >= 15 ? 0.5 : 1 }}
          onMouseEnter={e => { if (activities.length < 15) e.currentTarget.style.background = '#004f91'; }}
          onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
        >
          + Add Event
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((activity, index) => (
          <div key={index} style={eventCardStyle}>
            {/* Event card header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #e8edf2' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={eventNumberStyle}>{index + 1}</div>
                <span style={{ fontWeight: '600', color: '#0d1b2a', fontSize: '0.92rem' }}>
                  {activity.name || `Event ${index + 1}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeActivity(index)}
                style={removeBtnStyle}
                onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                Remove
              </button>
            </div>

            {/* Row 1: Name + Date */}
            <div style={twoColGrid}>
              <Field label="Event Name" required>
                <input type="text" value={activity.name} onChange={(e) => handleActivityChange(index, 'name', e.target.value)} placeholder="e.g. Annual Gala 2024" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Date">
                <input type="date" value={activity.date} onChange={(e) => handleActivityChange(index, 'date', e.target.value)} style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            {/* Row 2: Venue (full width) */}
            <div style={{ marginTop: '0.875rem' }}>
              <Field label="Venue">
                <input type="text" value={activity.venue} onChange={(e) => handleActivityChange(index, 'venue', e.target.value)} placeholder="e.g. Metro Convention Centre, Toronto" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            {/* Row 3: Capacity + Attendance */}
            <div style={{ ...twoColGrid, marginTop: '0.875rem' }}>
              <Field label="Capacity">
                <input type="text" value={activity.capacity} onChange={(e) => handleActivityChange(index, 'capacity', e.target.value)} placeholder="e.g. 500" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Total Attended">
                <input type="text" value={activity.attendanceCount} onChange={(e) => handleActivityChange(index, 'attendanceCount', e.target.value)} placeholder="e.g. 420" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            {/* Row 4: Ticket Price + Funds Collected */}
            <div style={{ ...twoColGrid, marginTop: '0.875rem' }}>
              <Field label="Ticket Price">
                <input type="text" value={activity.ticketPrice} onChange={(e) => handleActivityChange(index, 'ticketPrice', e.target.value)} placeholder="e.g. $75" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Funds Collected">
                <input type="text" value={activity.fundsCollected} onChange={(e) => handleActivityChange(index, 'fundsCollected', e.target.value)} placeholder="e.g. $32,000" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
            </div>

            {/* Row 5: Sponsors + Celebrity Guests */}
            <div style={{ ...twoColGrid, marginTop: '0.875rem' }}>
              <Field label="Tickets & Sponsors">
                <input type="text" value={activity.sponsors} onChange={(e) => handleActivityChange(index, 'sponsors', e.target.value)} placeholder="e.g. RBC, TD Bank" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
              </Field>
              <Field label="Celebrity / Notable Guests">
                <input type="text" value={activity.celebrityGuests} onChange={(e) => handleActivityChange(index, 'celebrityGuests', e.target.value)} placeholder="e.g. Dr. Jane Smith" style={inputStyle} onFocus={focusStyle} onBlur={blurStyle} />
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

const eventCardStyle = {
  background: '#f8fafc', border: '1px solid #e8edf2',
  borderRadius: '10px', padding: '1.1rem',
};

const eventNumberStyle = {
  width: '28px', height: '28px', borderRadius: '8px',
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

export default ChapterActivitiesForm;