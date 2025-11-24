// ChapterReviewForm.jsx
import React from 'react';

function ChapterReviewForm({ data, onSubmit }) {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ color: '#0060af', marginBottom: '1rem' }}>Review & Submit</h3>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
        <button 
          onClick={onSubmit} 
          style={{
            backgroundColor: '#e01b24', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            fontSize: '1rem', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer'
          }}
        >
          Submit Chapter Data
        </button>
      </div>
    </div>
  );
}

export default ChapterReviewForm;
