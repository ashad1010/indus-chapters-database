// EditChapterActivitiesForm.jsx
import React, { useState, useEffect } from 'react';

function EditChapterActivitiesForm({ initialData = [], onUpdate }) {
  const [activities, setActivities] = useState(initialData);

  useEffect(() => {
    onUpdate({ events: activities });
  }, [activities]);

  const addNewActivity = () => {
    if (activities.length >= 15) return;
    const newActivity = {
      name: '',
      date: '',
      venue: '',
      ticketPrice: '',
      celebrityGuests: '',
      capacity: '',
      attendanceCount: '',
      sponsors: '',
      fundsCollected: ''
    };
    setActivities([...activities, newActivity]);
  };

  const handleActivityChange = (index, field, value) => {
    const updated = [...activities];
    updated[index][field] = value;
    setActivities(updated);
  };

  const removeActivity = (index) => {
    const updated = activities.filter((_, i) => i !== index);
    setActivities(updated);
  };

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
        <h3 style={{ color: '#0060af', margin: 0 }}>Edit Chapter Events</h3>
        <button type="button" onClick={addNewActivity} style={{ background: '#0060af', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>+ Add New Event</button>
      </div>

      {activities.map((activity, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', background: '#f9f9f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, color: '#222' }}>Event {index + 1}</h4>
            <button type="button" onClick={() => removeActivity(index)} style={{ background: '#e01b24', color: 'white', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '4px', cursor: 'pointer' }}>✕ Remove</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', alignItems: 'center' }}>
            <label style={labelStyle}>Name:</label>
            <input type="text" value={activity.name} onChange={(e) => handleActivityChange(index, 'name', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Date:</label>
            <input type="date" value={activity.date} onChange={(e) => handleActivityChange(index, 'date', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Venue:</label>
            <input type="text" value={activity.venue} onChange={(e) => handleActivityChange(index, 'venue', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Ticket Price:</label>
            <input type="text" value={activity.ticketPrice} onChange={(e) => handleActivityChange(index, 'ticketPrice', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Celebrity Guests:</label>
            <input type="text" value={activity.celebrityGuests} onChange={(e) => handleActivityChange(index, 'celebrityGuests', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Capacity:</label>
            <input type="text" value={activity.capacity} onChange={(e) => handleActivityChange(index, 'capacity', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Total Attended:</label>
            <input type="text" value={activity.attendanceCount} onChange={(e) => handleActivityChange(index, 'attendanceCount', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Tickets & Sponsors:</label>
            <input type="text" value={activity.sponsors} onChange={(e) => handleActivityChange(index, 'sponsors', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Funds Collected:</label>
            <input type="text" value={activity.fundsCollected} onChange={(e) => handleActivityChange(index, 'fundsCollected', e.target.value)} style={inputStyle} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default EditChapterActivitiesForm;
