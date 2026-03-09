// ViewChapters.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import * as XLSX from 'xlsx';
import { useAuth } from '../AuthContext';
import EditChapterLocationForm from '../components/EditChapterLocationForm';
import EditChapterLinksForm from '../components/EditChapterLinksForm';
import EditChapterTeamForm from '../components/EditChapterTeamForm';
import EditChapterActivitiesForm from '../components/EditChapterActivitiesForm';

function ViewChapters() {
  const { userRole, userCountry } = useAuth();

  const [chapters, setChapters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filterCountry, setFilterCountry] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('❌ Fetch error:', error.message);
      } else {
        setChapters(data);
      }
      setLoading(false);
    };
    fetchChapters();
  }, [userRole, userCountry]);

  const filteredChapters = chapters.filter((chapter) => {
    const loc = chapter.location || {};
    const query = searchQuery.toLowerCase();
    const countryMatch = !filterCountry || loc.selectedCountry === filterCountry;
    const regionMatch = !filterRegion || loc.selectedRegion === filterRegion;
    return (
      (loc.chapterName?.toLowerCase().includes(query) ||
        loc.selectedCountry?.toLowerCase().includes(query) ||
        loc.selectedRegion?.toLowerCase().includes(query) ||
        loc.city?.toLowerCase().includes(query) ||
        chapter.description?.toLowerCase().includes(query)) &&
      countryMatch &&
      regionMatch
    );
  });

  const generateXLSXData = () => {
    const teamRows = [];
    const eventRows = [];
    filteredChapters.forEach((chapter) => {
      const loc = chapter.location || {};
      chapter.team_members?.forEach((member) => {
        teamRows.push({
          Chapter: loc.chapterName,
          Country: loc.selectedCountry,
          City: loc.city,
          Region: loc.selectedRegion,
          Name: member.name,
          Role: member.role,
          Phone: member.phone,
          Email: member.email,
          Title: member.title,
          Note: member.note,
          Status: member.status
        });
      });
      chapter.events?.forEach((event) => {
        eventRows.push({
          Chapter: loc.chapterName,
          Country: loc.selectedCountry,
          City: loc.city,
          Region: loc.selectedRegion,
          Name: event.name,
          Date: event.date,
          Venue: event.venue,
          TicketPrice: event.ticketPrice,
          CelebrityGuests: event.celebrityGuests,
          Capacity: event.capacity,
          Attendance: event.attendanceCount,
          Sponsors: event.sponsors,
          FundsCollected: event.fundsCollected
        });
      });
    });
    return { teamRows, eventRows };
  };

  const handleDownloadXLSX = () => {
    const { teamRows, eventRows } = generateXLSXData();
    if (teamRows.length === 0 && eventRows.length === 0) return alert('No data to export.');
    const wb = XLSX.utils.book_new();
    if (teamRows.length) {
      const ws1 = XLSX.utils.json_to_sheet(teamRows);
      XLSX.utils.book_append_sheet(wb, ws1, 'Team Members');
    }
    if (eventRows.length) {
      const ws2 = XLSX.utils.json_to_sheet(eventRows);
      XLSX.utils.book_append_sheet(wb, ws2, 'Events');
    }
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[:T]/g, '-');
    XLSX.writeFile(wb, `indus_report_${timestamp}.xlsx`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    const { error } = await supabase.from('chapters').delete().eq('id', id);
    if (error) {
      console.error('❌ Delete failed:', error.message);
      alert('Error deleting chapter');
    } else {
      setChapters((prev) => prev.filter((ch) => ch.id !== id));
    }
  };

  const handleEdit = (chapter) => {
    setEditingId(chapter.id);
    setExpandedId(chapter.id);
    setEditedData({
      ...chapter.location,
      description: chapter.description || '',
      social_links: chapter.social_links || {},
      team_members: chapter.team_members || [],
      events: chapter.events || []
    });
  };

  const handleUpdate = async (id) => {
    const { error } = await supabase
      .from('chapters')
      .update({
        location: {
          chapterName: editedData.chapterName,
          selectedCountry: editedData.selectedCountry,
          selectedRegion: editedData.selectedRegion,
          city: editedData.city,
          chapterDescription: editedData.chapterDescription || ''
        },
        description: editedData.description,
        social_links: editedData.social_links,
        team_members: editedData.team_members,
        events: editedData.events
      })
      .eq('id', id);

    if (error) {
      console.error('❌ Update failed:', error.message);
      alert('Error updating chapter');
    } else {
      const updatedChapters = chapters.map((ch) =>
        ch.id === id
          ? {
              ...ch,
              location: {
                chapterName: editedData.chapterName,
                selectedCountry: editedData.selectedCountry,
                selectedRegion: editedData.selectedRegion,
                city: editedData.city,
                chapterDescription: editedData.chapterDescription || ''
              },
              description: editedData.description,
              social_links: editedData.social_links,
              team_members: editedData.team_members,
              events: editedData.events
            }
          : ch
      );
      setChapters(updatedChapters);
      setEditingId(null);
      setEditedData({});
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    if (!activeTab[id]) {
      setActiveTab(prev => ({ ...prev, [id]: 'details' }));
    }
  };

  const setTab = (id, tab) => {
    setActiveTab(prev => ({ ...prev, [id]: tab }));
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', color: '#64748b', gap: '0.75rem' }}>
      <div style={{ width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTop: '2px solid #0060af', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading chapters…
    </div>
  );

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ color: '#0d1b2a', fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
          All Chapters
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          {filteredChapters.length} chapter{filteredChapters.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters + search bar */}
      <div style={toolbarStyle}>
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
              <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search chapters…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={searchInputStyle}
            />
          </div>

          {/* Country filter */}
          <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} style={selectStyle}>
            <option value="">All Countries</option>
            {[...new Set(chapters.map(c => c.location?.selectedCountry).filter(Boolean))].map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          {/* Region filter */}
          <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} style={selectStyle}>
            <option value="">All Regions</option>
            {[...new Set(chapters.map(c => c.location?.selectedRegion).filter(Boolean))].map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Export button */}
        {['admin', 'super_admin', 'editor'].includes(userRole) && (
          <button onClick={handleDownloadXLSX} style={exportButtonStyle}
            onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
            onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.4rem' }}>
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zM5 18h14v2H5v-2z" fill="white"/>
            </svg>
            Export XLSX
          </button>
        )}
      </div>

      {/* Empty state */}
      {filteredChapters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#64748b' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#374151' }}>No chapters found</div>
          <div style={{ fontSize: '0.875rem' }}>Try adjusting your search or filter criteria</div>
        </div>
      )}

      {/* Chapter cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredChapters.map((chapter, index) => {
          const loc = chapter.location || {};
          const team = chapter.team_members || [];
          const events = chapter.events || [];
          const isEditing = editingId === chapter.id;
          const isExpanded = expandedId === chapter.id;
          const tab = activeTab[chapter.id] || 'details';

          const canEditDelete =
            userRole === 'admin' ||
            userRole === 'super_admin' ||
            (userRole === 'editor' && loc.selectedCountry === userCountry);

          return (
            <div key={chapter.id || index} style={cardStyle}>

              {/* Card header — always visible */}
              <div
                style={cardHeaderStyle}
                onClick={() => !isEditing && toggleExpand(chapter.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  {/* Chapter initial avatar */}
                  <div style={chapterAvatarStyle}>
                    {(loc.chapterName || 'C').charAt(0).toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ color: '#0d1b2a', fontWeight: '700', fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {loc.chapterName || `Chapter ${index + 1}`}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                      {loc.selectedCountry && <Pill icon="🌍" text={loc.selectedCountry} />}
                      {loc.city && <Pill icon="📍" text={loc.city} />}
                      {loc.selectedRegion && <Pill icon="🗺️" text={loc.selectedRegion} />}
                    </div>
                  </div>
                </div>

                {/* Right side: stats + chevron */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  {team.length > 0 && (
                    <StatChip label={`${team.length} member${team.length !== 1 ? 's' : ''}`} color="#0060af" />
                  )}
                  {events.length > 0 && (
                    <StatChip label={`${events.length} event${events.length !== 1 ? 's' : ''}`} color="#0f7a4a" />
                  )}
                  {!isEditing && (
                    <div style={{ color: '#94a3b8', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid #e8edf2' }}>

                  {/* Edit mode */}
                  {isEditing ? (
                    <div style={{ padding: '1.5rem' }}>
                      <div style={editModeBannerStyle}>
                        ✏️ Editing: <strong>{loc.chapterName}</strong> — make your changes below and click Save when done.
                      </div>
                      <EditChapterLocationForm
                        initialData={chapter.location}
                        onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))}
                      />
                      <div style={sectionDividerStyle} />
                      <EditChapterLinksForm
                        initialData={chapter.social_links}
                        onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))}
                      />
                      <div style={sectionDividerStyle} />
                      <EditChapterTeamForm
                        initialData={chapter.team_members}
                        onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))}
                      />
                      <div style={sectionDividerStyle} />
                      <EditChapterActivitiesForm
                        initialData={chapter.events}
                        onUpdate={(updated) => setEditedData((prev) => ({ ...prev, ...updated }))}
                      />

                      {/* Save / Cancel */}
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e8edf2' }}>
                        <button
                          onClick={() => setEditingId(null)}
                          style={cancelBtnStyle}
                          onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                          onMouseLeave={e => e.currentTarget.style.background = 'white'}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(chapter.id)}
                          style={saveBtnStyle}
                          onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
                          onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>

                  ) : (
                    /* View mode with tabs */
                    <div>
                      {/* Tab bar */}
                      <div style={tabBarStyle}>
                        <TabButton active={tab === 'details'} onClick={() => setTab(chapter.id, 'details')}>Details</TabButton>
                        <TabButton active={tab === 'team'} onClick={() => setTab(chapter.id, 'team')}>
                          Team {team.length > 0 && <span style={tabCountStyle}>{team.length}</span>}
                        </TabButton>
                        <TabButton active={tab === 'events'} onClick={() => setTab(chapter.id, 'events')}>
                          Events {events.length > 0 && <span style={tabCountStyle}>{events.length}</span>}
                        </TabButton>
                        <TabButton active={tab === 'links'} onClick={() => setTab(chapter.id, 'links')}>Links</TabButton>
                      </div>

                      {/* Tab content */}
                      <div style={{ padding: '1.5rem' }}>

                        {/* DETAILS TAB */}
                        {tab === 'details' && (
                          <div style={detailsGridStyle}>
                            <DetailRow label="Country" value={loc.selectedCountry} />
                            <DetailRow label="City" value={loc.city} />
                            <DetailRow label="Region" value={loc.selectedRegion} />
                            {loc.chapterDescription && (
                              <div style={{ gridColumn: '1 / -1' }}>
                                <DetailRow label="Description" value={loc.chapterDescription} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* TEAM TAB */}
                        {tab === 'team' && (
                          team.length === 0 ? (
                            <EmptyTab message="No team members added yet." />
                          ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.875rem' }}>
                              {team.map((member, i) => (
                                <div key={i} style={memberCardStyle}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={memberAvatarStyle}>
                                      {(member.name || '?').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: '700', color: '#0d1b2a', fontSize: '0.92rem' }}>{member.name || '—'}</div>
                                      <div style={{ color: '#0060af', fontSize: '0.78rem', fontWeight: '600' }}>{member.role || '—'}</div>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                    {member.title && <MemberField icon="🏷️" value={member.title} />}
                                    {member.email && <MemberField icon="✉️" value={member.email} />}
                                    {member.phone && <MemberField icon="📞" value={member.phone} />}
                                    {member.status && (
                                      <div style={{ marginTop: '0.4rem' }}>
                                        <span style={{
                                          fontSize: '0.72rem',
                                          fontWeight: '600',
                                          padding: '0.2rem 0.6rem',
                                          borderRadius: '20px',
                                          background: member.status === 'active' ? '#dcfce7' : '#f1f5f9',
                                          color: member.status === 'active' ? '#166534' : '#475569',
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.05em'
                                        }}>
                                          {member.status}
                                        </span>
                                      </div>
                                    )}
                                    {member.note && <MemberField icon="📝" value={member.note} />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}

                        {/* EVENTS TAB */}
                        {tab === 'events' && (
                          events.length === 0 ? (
                            <EmptyTab message="No events added yet." />
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                              {events.map((event, i) => (
                                <div key={i} style={eventCardStyle}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                      <div style={{ fontWeight: '700', color: '#0d1b2a', fontSize: '0.97rem' }}>{event.name || `Event ${i + 1}`}</div>
                                      {event.date && <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.15rem' }}>📅 {event.date}</div>}
                                    </div>
                                    {event.fundsCollected && (
                                      <div style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700' }}>
                                        💰 {event.fundsCollected}
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.4rem' }}>
                                    {event.venue && <EventField label="Venue" value={event.venue} />}
                                    {event.capacity && <EventField label="Capacity" value={event.capacity} />}
                                    {event.attendanceCount && <EventField label="Attendance" value={event.attendanceCount} />}
                                    {event.ticketPrice && <EventField label="Ticket Price" value={event.ticketPrice} />}
                                    {event.sponsors && <EventField label="Sponsors" value={event.sponsors} />}
                                    {event.celebrityGuests && <EventField label="Guests" value={event.celebrityGuests} />}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}

                        {/* LINKS TAB */}
                        {tab === 'links' && (
                          <div>
                            {!chapter.social_links?.whatsappLink && !chapter.social_links?.socialLinks?.length ? (
                              <EmptyTab message="No links added yet." />
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                {chapter.social_links?.whatsappLink && (
                                  <LinkRow icon="💬" label="WhatsApp Group" href={chapter.social_links.whatsappLink} />
                                )}
                                {chapter.social_links?.socialLinks?.map((link, i) => (
                                  <LinkRow key={i} icon="🔗" label={`Social Link ${i + 1}`} href={link} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                      {/* Edit / Delete buttons */}
                      {canEditDelete && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', padding: '1rem 1.5rem', borderTop: '1px solid #e8edf2', background: '#f8fafc', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                          <button
                            onClick={() => handleDelete(chapter.id)}
                            style={deleteBtnStyle}
                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                            onMouseLeave={e => e.currentTarget.style.background = 'white'}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleEdit(chapter)}
                            style={editBtnStyle}
                            onMouseEnter={e => e.currentTarget.style.background = '#004f91'}
                            onMouseLeave={e => e.currentTarget.style.background = '#0060af'}
                          >
                            Edit Chapter
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Small helper components ────────────────────────────

function Pill({ icon, text }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: '20px' }}>
      {icon} {text}
    </span>
  );
}

function StatChip({ label, color }) {
  return (
    <span style={{ fontSize: '0.75rem', fontWeight: '600', color, background: `${color}14`, padding: '0.2rem 0.6rem', borderRadius: '20px', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.65rem 1.1rem',
        border: 'none',
        borderBottom: active ? '2px solid #0060af' : '2px solid transparent',
        background: 'transparent',
        color: active ? '#0060af' : '#64748b',
        fontWeight: active ? '700' : '500',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}
    >
      {children}
    </button>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.72rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ color: '#1e293b', fontSize: '0.92rem' }}>{value || '—'}</div>
    </div>
  );
}

function MemberField({ icon, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: '#475569' }}>
      <span>{icon}</span>
      <span style={{ wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

function EventField({ label, value }) {
  return (
    <div style={{ background: '#f8fafc', borderRadius: '6px', padding: '0.4rem 0.6rem' }}>
      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: '0.83rem', color: '#1e293b', marginTop: '0.1rem' }}>{value}</div>
    </div>
  );
}

function LinkRow({ icon, label, href }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e8edf2' }}>
      <span>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <a href={href} target="_blank" rel="noreferrer" style={{ color: '#0060af', fontSize: '0.85rem', textDecoration: 'none', wordBreak: 'break-all' }}>
          {href}
        </a>
      </div>
    </div>
  );
}

function EmptyTab({ message }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontSize: '0.875rem' }}>
      {message}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────

const toolbarStyle = {
  display: 'flex',
  gap: '0.75rem',
  marginBottom: '1.25rem',
  alignItems: 'center',
  flexWrap: 'wrap',
  background: 'white',
  padding: '1rem',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
};

const searchInputStyle = {
  width: '100%',
  padding: '0.6rem 0.75rem 0.6rem 2.25rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  fontSize: '0.88rem',
  color: '#1e293b',
  outline: 'none',
  background: '#f8fafc',
  boxSizing: 'border-box',
};

const selectStyle = {
  padding: '0.6rem 0.75rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  fontSize: '0.85rem',
  color: '#374151',
  background: '#f8fafc',
  outline: 'none',
  cursor: 'pointer',
};

const exportButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0.6rem 1.1rem',
  background: '#0060af',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.15s',
};

const cardStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #e8edf2',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  overflow: 'hidden',
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '1.1rem 1.5rem',
  cursor: 'pointer',
  gap: '1rem',
  userSelect: 'none',
};

const chapterAvatarStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  background: 'linear-gradient(135deg, #0060af, #003f75)',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '800',
  fontSize: '1rem',
  flexShrink: 0,
};

const tabBarStyle = {
  display: 'flex',
  borderBottom: '1px solid #e8edf2',
  padding: '0 1rem',
  background: '#fafbfc',
};

const tabCountStyle = {
  background: '#e2e8f0',
  color: '#475569',
  fontSize: '0.7rem',
  fontWeight: '700',
  padding: '0.1rem 0.4rem',
  borderRadius: '20px',
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '1rem',
};

const memberCardStyle = {
  background: '#f8fafc',
  border: '1px solid #e8edf2',
  borderRadius: '10px',
  padding: '1rem',
};

const memberAvatarStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#0060af',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '0.875rem',
  flexShrink: 0,
};

const eventCardStyle = {
  background: '#f8fafc',
  border: '1px solid #e8edf2',
  borderRadius: '10px',
  padding: '1rem',
};

const editModeBannerStyle = {
  background: '#eff6ff',
  border: '1px solid #bfdbfe',
  color: '#1e40af',
  padding: '0.75rem 1rem',
  borderRadius: '8px',
  fontSize: '0.875rem',
  marginBottom: '1.5rem',
};

const sectionDividerStyle = {
  height: '1px',
  background: '#e8edf2',
  margin: '1.5rem 0',
};

const saveBtnStyle = {
  padding: '0.6rem 1.4rem',
  background: '#0060af',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const cancelBtnStyle = {
  padding: '0.6rem 1.2rem',
  background: 'white',
  color: '#374151',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  fontWeight: '500',
  fontSize: '0.9rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const editBtnStyle = {
  padding: '0.5rem 1.1rem',
  background: '#0060af',
  color: 'white',
  border: 'none',
  borderRadius: '7px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const deleteBtnStyle = {
  padding: '0.5rem 1.1rem',
  background: 'white',
  color: '#dc2626',
  border: '1.5px solid #fecaca',
  borderRadius: '7px',
  fontWeight: '600',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

export default ViewChapters;