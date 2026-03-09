// ChapterReviewForm.jsx
import React from 'react';

function ChapterReviewForm({ data, onSubmit, isSubmitting }) {
  const loc = data?.location || {};
  const team = data?.team_members || [];
  const events = data?.events || [];
  const links = data?.social_links || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Info banner */}
      <div style={infoBannerStyle}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" stroke="#0060af" strokeWidth="2"/>
          <path d="M12 8v4M12 16h.01" stroke="#0060af" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>Please review the information below before submitting. Once saved, you can edit it from the View Chapters page.</span>
      </div>

      {/* Location summary */}
      <ReviewSection title="📍 Location" color="#0060af">
        <SummaryGrid>
          <SummaryField label="Chapter Name" value={loc.chapterName} highlight />
          <SummaryField label="Country" value={loc.selectedCountry} />
          <SummaryField label="City" value={loc.city} />
          <SummaryField label="State / Province" value={loc.selectedRegion} />
          {loc.chapterDescription && (
            <div style={{ gridColumn: '1 / -1' }}>
              <SummaryField label="Description" value={loc.chapterDescription} />
            </div>
          )}
        </SummaryGrid>
      </ReviewSection>

      {/* Team summary */}
      {team.length > 0 && (
        <ReviewSection title={`👥 Team Members (${team.length})`} color="#0060af">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {team.map((member, i) => (
              <div key={i} style={summaryRowStyle}>
                <div style={rowAvatarStyle}>{(member.name || '?').charAt(0).toUpperCase()}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#0d1b2a', fontSize: '0.9rem' }}>{member.name || '—'}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {[member.role, member.title, member.email].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
                {member.status && (
                  <span style={statusBadgeStyle}>{member.status}</span>
                )}
              </div>
            ))}
          </div>
        </ReviewSection>
      )}

      {/* Events summary */}
      {events.length > 0 && (
        <ReviewSection title={`📅 Events (${events.length})`} color="#0060af">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {events.map((event, i) => (
              <div key={i} style={summaryRowStyle}>
                <div style={{ ...rowAvatarStyle, background: '#0f7a4a', borderRadius: '8px' }}>📅</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '600', color: '#0d1b2a', fontSize: '0.9rem' }}>{event.name || `Event ${i + 1}`}</div>
                  <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                    {[event.date, event.venue].filter(Boolean).join(' · ') || 'No details'}
                  </div>
                </div>
                {event.fundsCollected && (
                  <span style={{ ...statusBadgeStyle, background: '#dcfce7', color: '#166534' }}>
                    💰 {event.fundsCollected}
                  </span>
                )}
              </div>
            ))}
          </div>
        </ReviewSection>
      )}

      {/* Links summary */}
      {(links.whatsappLink || links.socialLinks?.some(l => l)) && (
        <ReviewSection title="🔗 Links" color="#0060af">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {links.whatsappLink && (
              <div style={{ fontSize: '0.85rem', color: '#374151' }}>
                <span style={{ fontWeight: '600' }}>WhatsApp: </span>
                <a href={links.whatsappLink} target="_blank" rel="noreferrer" style={{ color: '#0060af' }}>{links.whatsappLink}</a>
              </div>
            )}
            {links.socialLinks?.filter(l => l).map((link, i) => (
              <div key={i} style={{ fontSize: '0.85rem', color: '#374151' }}>
                <span style={{ fontWeight: '600' }}>Link {i + 1}: </span>
                <a href={link} target="_blank" rel="noreferrer" style={{ color: '#0060af' }}>{link}</a>
              </div>
            ))}
          </div>
        </ReviewSection>
      )}

      {/* Empty sections notice */}
      {team.length === 0 && events.length === 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#92400e' }}>
          ⚠️ No team members or events added — you can always edit the chapter later to add these.
        </div>
      )}

      {/* Submit button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          style={{ ...submitBtnStyle, opacity: isSubmitting ? 0.7 : 1 }}
          onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = '#166534'; }}
          onMouseLeave={e => e.currentTarget.style.background = '#0f7a4a'}
        >
          {isSubmitting ? 'Saving…' : '✅ Submit Chapter'}
        </button>
      </div>

    </div>
  );
}

function ReviewSection({ title, color, children }) {
  return (
    <div style={{ border: '1px solid #e8edf2', borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ background: '#f8fafc', padding: '0.7rem 1rem', borderBottom: '1px solid #e8edf2', fontWeight: '700', fontSize: '0.875rem', color: '#0d1b2a' }}>
        {title}
      </div>
      <div style={{ padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
}

function SummaryGrid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.875rem' }}>
      {children}
    </div>
  );
}

function SummaryField({ label, value, highlight }) {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', color: highlight ? '#0060af' : '#1e293b', fontWeight: highlight ? '700' : '400' }}>{value || '—'}</div>
    </div>
  );
}

const infoBannerStyle = {
  display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
  background: '#eff6ff', border: '1px solid #bfdbfe',
  color: '#1e40af', padding: '0.8rem 1rem',
  borderRadius: '8px', fontSize: '0.85rem', lineHeight: 1.55,
};

const summaryRowStyle = {
  display: 'flex', alignItems: 'center', gap: '0.75rem',
  padding: '0.65rem 0.75rem',
  background: '#f8fafc', borderRadius: '8px',
  border: '1px solid #e8edf2',
};

const rowAvatarStyle = {
  width: '32px', height: '32px', borderRadius: '50%',
  background: '#0060af', color: 'white',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: '700', fontSize: '0.875rem', flexShrink: 0,
};

const statusBadgeStyle = {
  fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.6rem',
  borderRadius: '20px', background: '#e2e8f0', color: '#475569',
  textTransform: 'capitalize', whiteSpace: 'nowrap',
};

const submitBtnStyle = {
  padding: '0.75rem 2rem',
  background: '#0f7a4a',
  color: 'white', border: 'none',
  borderRadius: '9px', fontWeight: '700',
  fontSize: '0.97rem', cursor: 'pointer',
  transition: 'background 0.15s',
  letterSpacing: '0.01em',
};

export default ChapterReviewForm;