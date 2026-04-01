import React, { useState, useEffect } from 'react';
import { getUserResponse } from '../App';

const SHEET_API_URL = 'https://opensheet.elk.sh/15ExPw5ifVM_9IOUlp6eERhvy3BCVTghuLLNhskYEIns/data';

function AdminDashboard({ user, onLogout }) {
  const [loyalists, setLoyalists] = useState([]);
  const [formalists, setFormalists] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // 'students', 'loyalists', 'formalists'
  const [searchQuery, setSearchQuery] = useState('');
  const [cvModalOpen, setCvModalOpen] = useState(false);
  const [currentCVUrl, setCurrentCVUrl] = useState('');
  const [currentOriginalCVUrl, setCurrentOriginalCVUrl] = useState('');
  const [cvLoadError, setCvLoadError] = useState(false);

  const ADMIN_NAME = 'Divyansh Gourha';
  const ADMIN_EMAIL = 'whybanned893@gmail.com';

  const isAuthorized = () => {
    const userName = user?.['Full Name']?.trim();
    const userEmail = user?.['Email Address']?.trim().toLowerCase();
    return userName === ADMIN_NAME && userEmail === ADMIN_EMAIL;
  };

  useEffect(() => {
    if (!isAuthorized()) {
      setError('Access denied. You are not authorized to view this page.');
      setLoading(false);
      return;
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch Google Sheet data
      let sheetData = [];
      try {
        const res = await fetch(SHEET_API_URL);
        if (res.ok) {
          sheetData = await res.json();
        }
      } catch (sheetErr) {
        console.warn('Failed to fetch sheet data:', sheetErr);
      }

      // Map sheet columns to student data - try multiple possible column names
      const mappedStudents = sheetData.map(row => {
        // Try to find CV link from any possible column name
        const cvLink = (row['Attach Latest Resume/CV'] || row['CV/Resume Link'] || row['CV Link'] || row['CV'] || 
                        row['Resume'] || row['Resume Link'] || row['CV/Resume'] ||
                        row['cv'] || row['resume'] || row['cv_link'] || 
                        row['CV/Resume (Google Drive Link)'] || '').trim();
        
        // Log first row for debugging
        if (sheetData.indexOf(row) === 0) {
          console.log('Sheet columns:', Object.keys(row));
          console.log('First row CV value:', cvLink);
        }

        return {
          name: (row['Full Name'] || row['Name'] || row['full name'] || '').trim(),
          email: (row['Email Address'] || row['Email'] || row['email'] || '').trim(),
          branch: (row['Current Engineering Branch'] || row['Branch'] || row['branch'] || '').trim(),
          cgpa: (row['Cumulative Grade Point Average (CGPA)'] || row['CGPA'] || row['cgpa'] || '').trim(),
          skills: (row['Skills and Expertise'] || row['Skills'] || row['skills'] || '').trim(),
          cvLink: cvLink,
        };
      }).filter(s => s.name || s.email);

      setStudents(mappedStudents);

      // Build email -> name mapping for response matching
      const sheetNameMap = {};
      sheetData.forEach(row => {
        const email = (row['Email Address'] || '').trim().toLowerCase();
        const name = (row['Full Name'] || '').trim();
        if (email && name) {
          sheetNameMap[email] = name;
        }
      });

      // Process localStorage responses
      const loyalistsList = [];
      const formalistsList = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vortex_status_')) {
          const uid = key.replace('vortex_status_', '');
          const response = getUserResponse(uid);
          if (response) {
            const resolvedName = response.name || sheetNameMap[uid] || '';
            const entry = {
              uid,
              email: uid,
              name: resolvedName,
              agreed: response.agreed,
              timestamp: response.timestamp,
            };
            if (response.agreed) {
              loyalistsList.push(entry);
            } else {
              formalistsList.push(entry);
            }
          }
        }
      }

      setLoyalists(loyalistsList.sort((a, b) => b.timestamp - a.timestamp));
      setFormalists(formalistsList.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
    } catch (err) {
      setError('Failed to load data.');
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      students,
      loyalists,
      formalists,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin_data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterStudents = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(s =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.email && s.email.toLowerCase().includes(q)) ||
      (s.branch && s.branch.toLowerCase().includes(q)) ||
      (s.skills && s.skills.toLowerCase().includes(q))
    );
  };

  const filterResponses = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(s =>
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
    );
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Convert Google Drive links to embeddable format
  const formatCVLink = (url) => {
    if (!url) return { preview: '', view: url };
    
    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
      // Extract file ID from various URL formats
      let fileId = null;
      
      // Format: /d/[FILE_ID]/view or /d/[FILE_ID]/preview
      const matchD = url.match(/\/d\/([^/]+)/);
      if (matchD) {
        fileId = matchD[1];
      }
      
      // Format: open?id=[FILE_ID]
      if (!fileId) {
        const matchOpen = url.match(/open\?id=([^&]+)/);
        if (matchOpen) {
          fileId = matchOpen[1];
        }
      }
      
      // Format: file/d/[FILE_ID]
      if (!fileId) {
        const matchFile = url.match(/file\/d\/([^/]+)/);
        if (matchFile) {
          fileId = matchFile[1];
        }
      }
      
      if (fileId) {
        return {
          preview: `https://drive.google.com/file/d/${fileId}/preview`,
          view: `https://drive.google.com/file/d/${fileId}/view`
        };
      }
    }
    
    // Return original URL if not a Google Drive link
    return { preview: url, view: url };
  };

  // Get viewable link for new tab
  const getViewLink = (url) => {
    const formatted = formatCVLink(url);
    return formatted.view;
  };

  const openCVModal = (cvLink) => {
    const formatted = formatCVLink(cvLink);
    setCurrentCVUrl(formatted.preview);
    setCurrentOriginalCVUrl(formatted.view);
    setCvLoadError(false);
    setCvModalOpen(true);
  };

  const closeCVModal = () => {
    setCvModalOpen(false);
    setCurrentCVUrl('');
    setCurrentOriginalCVUrl('');
    setCvLoadError(false);
  };

  const handleCVLoadError = () => {
    setCvLoadError(true);
  };

  if (!isAuthorized()) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0000, #2d0a0a)', padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,0,0,0.08)', border: '2px solid rgba(255,0,0,0.4)',
          borderRadius: '20px', padding: '40px', textAlign: 'center', maxWidth: '400px', color: '#ffcccc'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ color: '#ff3333', marginBottom: '12px' }}>Access Denied</h2>
          <p style={{ marginBottom: '24px', opacity: 0.8 }}>You are not authorized to view this page.</p>
          <button onClick={onLogout} style={{
            background: 'transparent', border: '2px solid rgba(255,0,0,0.5)',
            color: '#ff3333', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
          }}>Go Back</button>
        </div>
      </div>
    );
  }

  const filteredStudents = filterStudents(students);
  const filteredLoyalists = filterResponses(loyalists);
  const filteredFormalists = filterResponses(formalists);

  return (
    <div className="admin-page-wrapper">
      <div className="bg-blob blob-1" />
      <div className="bg-blob blob-2" />
      <div className="bg-blob blob-3" />

      <div className="adm-root">
        {/* Header */}
        <div className="adm-header">
          <div className="adm-header-left">
            <h1 className="adm-title">🛡️ Commander's Dashboard</h1>
            <p className="adm-subtitle">Student Data & Response Tracker</p>
          </div>
          <div className="adm-header-actions">
            <button className="adm-refresh-btn" onClick={fetchAllData} title="Refresh">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Refresh
            </button>
            <button className="adm-export-btn" onClick={exportData}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="adm-stats">
          <div className="adm-stat-card total-card">
            <div className="stat-icon">👥</div>
            <div className="stat-body">
              <div className="stat-num">{students.length}</div>
              <div className="stat-lbl">Total Students</div>
            </div>
          </div>
          <div className="adm-stat-card loyalist-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-body">
              <div className="stat-num">{loyalists.length}</div>
              <div className="stat-lbl">Agreed</div>
            </div>
          </div>
          <div className="adm-stat-card formalist-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-body">
              <div className="stat-num">{formalists.length}</div>
              <div className="stat-lbl">Disagreed</div>
            </div>
          </div>
          {loyalists.length + formalists.length > 0 && (
            <div className="adm-stat-card rate-card">
              <div className="stat-icon">📈</div>
              <div className="stat-body">
                <div className="stat-num">
                  {Math.round((loyalists.length / (loyalists.length + formalists.length)) * 100)}%
                </div>
                <div className="stat-lbl">Agreement Rate</div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Bar + Search */}
        <div className="adm-controls">
          <div className="adm-tabs">
            <button
              className={`adm-tab ${activeTab === 'students' ? 'active student-tab' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              👥 Students
              <span className="tab-count">{students.length}</span>
            </button>
            <button
              className={`adm-tab ${activeTab === 'loyalists' ? 'active loyalist-tab' : ''}`}
              onClick={() => setActiveTab('loyalists')}
            >
              🔥 Agreed
              <span className="tab-count">{loyalists.length}</span>
            </button>
            <button
              className={`adm-tab ${activeTab === 'formalists' ? 'active formalist-tab' : ''}`}
              onClick={() => setActiveTab('formalists')}
            >
              ⚠️ Disagreed
              <span className="tab-count">{formalists.length}</span>
            </button>
          </div>
          <div className="adm-search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              className="adm-search"
              type="text"
              placeholder="Search by name, email, branch…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="adm-list-container">
          {loading ? (
            <div className="adm-state">
              <div className="adm-spinner" />
              <p>Loading data from Google Sheets…</p>
            </div>
          ) : error ? (
            <div className="adm-state error">
              <span style={{ fontSize: '32px' }}>⚠️</span>
              <p>{error}</p>
            </div>
          ) : activeTab === 'students' ? (
            filteredStudents.length === 0 ? (
              <div className="adm-state">
                <span style={{ fontSize: '40px' }}>👥</span>
                <p style={{ marginTop: '12px', color: 'rgba(150,200,255,0.6)' }}>
                  {searchQuery ? 'No students match your search.' : 'No student data available.'}
                </p>
              </div>
            ) : (
              <div className="adm-table-wrapper">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Branch</th>
                      <th>CGPA</th>
                      <th>Skills</th>
                      <th>CV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={index}>
                        <td className="row-num">{index + 1}</td>
                        <td>
                          <div className="table-name-cell">
                            <div className="table-avatar">{getInitials(student.name)}</div>
                            <span className="table-name">{student.name || '—'}</span>
                          </div>
                        </td>
                        <td className="table-email">{student.email || '—'}</td>
                        <td className="table-branch">{student.branch || '—'}</td>
                        <td className="table-cgpa">{student.cgpa || '—'}</td>
                        <td className="table-skills">{student.skills || '—'}</td>
                        <td className="table-cv">
                          {student.cvLink ? (
                            <div className="cv-actions">
                              <button
                                onClick={() => openCVModal(student.cvLink)}
                                className="view-cv-btn"
                                title="Preview CV"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                Preview
                              </button>
                              <a
                                href={getViewLink(student.cvLink)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="view-cv-btn external"
                                title="Open in new tab"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                  <polyline points="15 3 21 3 21 9" />
                                  <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                              </a>
                            </div>
                          ) : (
                            <span className="no-cv">No CV</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // Response lists (loyalists/formalists)
            (() => {
              const list = activeTab === 'loyalists' ? filteredLoyalists : filteredFormalists;
              return list.length === 0 ? (
                <div className="adm-state">
                  <span style={{ fontSize: '40px' }}>{activeTab === 'loyalists' ? '🔥' : '⚠️'}</span>
                  <p style={{ marginTop: '12px', color: 'rgba(150,200,255,0.6)' }}>
                    {searchQuery ? 'No results match your search.' : activeTab === 'loyalists' ? 'No students agreed yet.' : 'No students disagreed yet.'}
                  </p>
                </div>
              ) : (
                <div className="adm-grid">
                  {list.map((student, index) => (
                    <div key={student.uid} className={`adm-card ${activeTab === 'loyalists' ? 'loyalist-border' : 'formalist-border'}`}>
                      <div className="adm-card-left">
                        <div className={`adm-avatar ${activeTab === 'loyalists' ? 'loyalist-avatar' : 'formalist-avatar'}`}>
                          {getInitials(student.name)}
                        </div>
                      </div>
                      <div className="adm-card-body">
                        <div className="adm-card-name">
                          {student.name || <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Unknown Name</span>}
                        </div>
                        <div className="adm-card-email">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          {student.email}
                        </div>
                        <div className="adm-card-time">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                          </svg>
                          {new Date(student.timestamp).toLocaleString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </div>
                      </div>
                      <div className="adm-card-badge">
                        {activeTab === 'loyalists'
                          ? <span className="badge-yes">✓ Agreed</span>
                          : <span className="badge-no">✗ Disagreed</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>

        {/* CV Preview Modal */}
        {cvModalOpen && (
          <div className="cv-modal-overlay" onClick={closeCVModal}>
            <div className="cv-modal-content" onClick={e => e.stopPropagation()}>
              <div className="cv-modal-header">
                <h3>📄 CV Preview</h3>
                <button className="cv-modal-close" onClick={closeCVModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="cv-modal-body">
                {cvLoadError ? (
                  <div className="cv-error-message">
                    <div className="cv-error-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <h4>Access Denied</h4>
                    <p>Please ensure the Google Drive folder permissions are set to "Anyone with the link" or "Public".</p>
                    <a
                      href={currentOriginalCVUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cv-error-link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Try opening directly
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={currentCVUrl}
                    title="CV Preview"
                    className="cv-iframe"
                    onError={handleCVLoadError}
                  />
                )}
              </div>
              <div className="cv-modal-footer">
                <a
                  href={currentOriginalCVUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cv-open-external"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .adm-root {
            min-height: 100vh;
            padding: 80px 32px 40px;
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 2rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            max-width: 1200px;
            margin: 20px auto;
            box-sizing: border-box;
          }

          .adm-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 28px;
            flex-wrap: wrap;
            gap: 16px;
          }
          .adm-title {
            font-size: 28px;
            font-weight: 800;
            color: #e8f4ff;
            margin: 0 0 4px;
            text-shadow: 0 0 20px rgba(0, 180, 255, 0.3);
          }
          .adm-subtitle {
            font-size: 13px;
            color: rgba(150, 200, 255, 0.6);
            margin: 0;
          }
          .adm-header-actions {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          .adm-refresh-btn, .adm-export-btn {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .adm-refresh-btn {
            background: rgba(0, 180, 255, 0.08);
            border: 1px solid rgba(0, 180, 255, 0.25);
            color: rgba(0, 200, 255, 0.8);
          }
          .adm-refresh-btn:hover {
            background: rgba(0, 180, 255, 0.15);
            color: #00d4ff;
          }
          .adm-export-btn {
            background: linear-gradient(135deg, rgba(0, 180, 255, 0.2), rgba(0, 80, 200, 0.2));
            border: 1px solid rgba(0, 180, 255, 0.35);
            color: #00d4ff;
          }
          .adm-export-btn:hover {
            background: linear-gradient(135deg, rgba(0, 180, 255, 0.3), rgba(0, 80, 200, 0.3));
            box-shadow: 0 0 15px rgba(0, 180, 255, 0.25);
          }

          .adm-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 28px;
          }
          .adm-stat-card {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 18px 20px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.06);
            transition: transform 0.2s ease;
          }
          .adm-stat-card:hover { transform: translateY(-2px); }
          .loyalist-card { border-left: 3px solid #ffcc00; }
          .formalist-card { border-left: 3px solid #ff6b6b; }
          .total-card { border-left: 3px solid #00b4ff; }
          .rate-card { border-left: 3px solid #00ff88; }
          .stat-icon { font-size: 28px; }
          .stat-num {
            font-size: 28px;
            font-weight: 800;
            line-height: 1;
            margin-bottom: 4px;
          }
          .loyalist-card .stat-num { color: #ffcc00; }
          .formalist-card .stat-num { color: #ff6b6b; }
          .total-card .stat-num { color: #00b4ff; }
          .rate-card .stat-num { color: #00ff88; }
          .stat-lbl {
            font-size: 11px;
            color: rgba(150, 200, 255, 0.6);
            font-weight: 500;
          }

          .adm-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            gap: 16px;
            flex-wrap: wrap;
          }
          .adm-tabs {
            display: flex;
            gap: 6px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            padding: 4px;
          }
          .adm-tab {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 18px;
            border-radius: 7px;
            border: none;
            background: transparent;
            color: rgba(150, 200, 255, 0.6);
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .adm-tab:hover { color: #e8f4ff; background: rgba(255,255,255,0.04); }
          .adm-tab.active { font-weight: 700; }
          .adm-tab.student-tab { background: rgba(0, 180, 255, 0.12); color: #00d4ff; }
          .adm-tab.loyalist-tab { background: rgba(255, 204, 0, 0.12); color: #ffcc00; }
          .adm-tab.formalist-tab { background: rgba(255, 107, 107, 0.12); color: #ff6b6b; }
          .tab-count {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 1px 8px;
            font-size: 11px;
            font-weight: 700;
          }
          .adm-tab.student-tab .tab-count { background: rgba(0, 180, 255, 0.2); color: #00d4ff; }
          .adm-tab.loyalist-tab .tab-count { background: rgba(255, 204, 0, 0.2); color: #ffcc00; }
          .adm-tab.formalist-tab .tab-count { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }

          .adm-search-wrap {
            position: relative;
            display: flex;
            align-items: center;
          }
          .search-icon {
            position: absolute;
            left: 12px;
            color: rgba(150, 200, 255, 0.5);
            pointer-events: none;
          }
          .adm-search {
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(0, 180, 255, 0.2);
            border-radius: 8px;
            padding: 8px 36px 8px 32px;
            color: #e8f4ff;
            font-size: 13px;
            width: 240px;
            outline: none;
            transition: border-color 0.2s ease;
          }
          .adm-search::placeholder { color: rgba(150, 200, 255, 0.4); }
          .adm-search:focus { border-color: rgba(0, 180, 255, 0.5); }
          .search-clear {
            position: absolute;
            right: 10px;
            background: none;
            border: none;
            color: rgba(150, 200, 255, 0.5);
            cursor: pointer;
            font-size: 12px;
          }
          .search-clear:hover { color: #e8f4ff; }

          .adm-list-container {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 16px;
            overflow: hidden;
            min-height: 200px;
          }
          .adm-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px 20px;
            color: rgba(150, 200, 255, 0.6);
            font-size: 14px;
            gap: 8px;
          }
          .adm-state.error { color: #ff6b6b; }
          .adm-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid rgba(0, 180, 255, 0.15);
            border-top-color: #00b4ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-bottom: 8px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }

          /* Student Table */
          .adm-table-wrapper {
            overflow-x: auto;
            max-height: 500px;
            overflow-y: auto;
          }
          .adm-table-wrapper::-webkit-scrollbar { width: 6px; height: 6px; }
          .adm-table-wrapper::-webkit-scrollbar-thumb { background: rgba(0, 180, 255, 0.3); border-radius: 10px; }
          .adm-table-wrapper::-webkit-scrollbar-track { background: transparent; }

          .adm-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          .adm-table thead {
            position: sticky;
            top: 0;
            z-index: 10;
          }
          .adm-table th {
            background: rgba(0, 180, 255, 0.1);
            color: #00d4ff;
            padding: 12px 16px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid rgba(0, 180, 255, 0.2);
            white-space: nowrap;
          }
          .adm-table td {
            padding: 10px 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
            color: rgba(200, 220, 255, 0.8);
            vertical-align: middle;
          }
          .adm-table tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
          }
          .row-num {
            color: rgba(150, 200, 255, 0.4);
            font-weight: 600;
            text-align: center;
            width: 40px;
          }
          .table-name-cell {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .table-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(0, 180, 255, 0.12);
            border: 1px solid rgba(0, 180, 255, 0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            color: #00d4ff;
            flex-shrink: 0;
          }
          .table-name {
            font-weight: 600;
            color: #e8f4ff;
            white-space: nowrap;
          }
          .table-email {
            color: rgba(150, 200, 255, 0.6);
            font-size: 12px;
            max-width: 180px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .table-branch {
            white-space: nowrap;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .table-cgpa {
            text-align: center;
            font-weight: 600;
            color: #00ff88;
          }
          .table-skills {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 12px;
            color: rgba(200, 220, 255, 0.6);
          }
          .table-cv {
            text-align: center;
          }
          .view-cv-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px 12px;
            background: rgba(0, 180, 255, 0.1);
            border: 1px solid rgba(0, 180, 255, 0.25);
            border-radius: 6px;
            color: #00d4ff;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.2s ease;
            white-space: nowrap;
          }
          .view-cv-btn:hover {
            background: rgba(0, 180, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 180, 255, 0.2);
          }
          .no-cv {
            color: rgba(150, 200, 255, 0.3);
            font-size: 11px;
          }

          /* CV Actions */
          .cv-actions {
            display: flex;
            gap: 6px;
            justify-content: center;
            align-items: center;
          }
          .view-cv-btn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 5px 10px;
            background: rgba(0, 180, 255, 0.1);
            border: 1px solid rgba(0, 180, 255, 0.25);
            border-radius: 6px;
            color: #00d4ff;
            text-decoration: none;
            font-size: 11px;
            font-weight: 600;
            transition: all 0.2s ease;
            white-space: nowrap;
            cursor: pointer;
          }
          .view-cv-btn:hover {
            background: rgba(0, 180, 255, 0.2);
            box-shadow: 0 0 10px rgba(0, 180, 255, 0.2);
          }
          .view-cv-btn.external {
            padding: 5px 8px;
          }

          /* CV Modal */
          .cv-modal-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 20px;
          }
          .cv-modal-content {
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(0, 180, 255, 0.2);
            border-radius: 1.5rem;
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          }
          .cv-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
          .cv-modal-header h3 {
            margin: 0;
            color: #e8f4ff;
            font-size: 18px;
            font-weight: 700;
          }
          .cv-modal-close {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(255, 255, 255, 0.6);
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .cv-modal-close:hover {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border-color: rgba(239, 68, 68, 0.3);
          }
          .cv-modal-body {
            flex: 1;
            min-height: 400px;
            padding: 0;
            overflow: hidden;
          }
          .cv-iframe {
            width: 100%;
            height: 100%;
            min-height: 500px;
            border: none;
            background: white;
          }
          .cv-modal-footer {
            padding: 16px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            justify-content: flex-end;
          }
          .cv-open-external {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            background: rgba(0, 180, 255, 0.1);
            border: 1px solid rgba(0, 180, 255, 0.25);
            border-radius: 8px;
            color: #00d4ff;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .cv-open-external:hover {
            background: rgba(0, 180, 255, 0.2);
            box-shadow: 0 0 15px rgba(0, 180, 255, 0.2);
          }

          /* CV Error Message */
          .cv-error-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
            min-height: 300px;
          }
          .cv-error-icon {
            color: #ff6b6b;
            margin-bottom: 16px;
          }
          .cv-error-message h4 {
            color: #ff6b6b;
            font-size: 18px;
            margin: 0 0 8px;
            font-weight: 700;
          }
          .cv-error-message p {
            color: rgba(200, 220, 255, 0.7);
            font-size: 14px;
            margin: 0 0 20px;
            line-height: 1.5;
            max-width: 400px;
          }
          .cv-error-link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 20px;
            background: rgba(0, 180, 255, 0.1);
            border: 1px solid rgba(0, 180, 255, 0.25);
            border-radius: 8px;
            color: #00d4ff;
            text-decoration: none;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          .cv-error-link:hover {
            background: rgba(0, 180, 255
            .adm-table th, .adm-table td { padding: 8px 10px; }
          }
          @media (max-width: 480px) {
            .adm-root { padding: 72px 10px 20px; }
            .adm-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
            .adm-stat-card { padding: 14px; }
            .stat-num { font-size: 22px; }
            .adm-tabs { flex-wrap: wrap; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdminDashboard;
