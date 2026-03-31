import { useState, useEffect } from 'react';
import { isBITBhilai } from '../utils/bitDetection';
import BITAlertModal from './BITAlertModal';

function Dashboard({ user, onLogout, onGoToInternships }) {
  const [showBITAlert, setShowBITAlert] = useState(false);

  useEffect(() => {
    if (isBITBhilai(user)) {
      setShowBITAlert(true);
    }
  }, [user]);

  const fields = [
    {
      label: 'Email',
      value: user['Email Address'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: 'Branch',
      value: user['Current Engineering Branch'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      label: 'CGPA',
      value: user['Cumulative Grade Point Average (CGPA)'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: 'Skills & Expertise',
      value: user['Skills and Expertise'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      wide: true,
    },
    {
      label: 'Preferred Domain(s)',
      value: user['Preferred Domain(s) for Internship'],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      wide: true,
    },
  ];

  const initials = user['Full Name']
    ?.split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="dashboard-container">
      {showBITAlert && (
        <BITAlertModal user={user} onContinue={() => setShowBITAlert(false)} />
      )}
      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="avatar">{initials}</div>
            <div className="header-info">
              <h1 className="user-name">{user['Full Name']}</h1>
              <span className="user-badge">Intern Candidate</span>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>

        {/* Internship Finder Button */}
        <div className="internships-cta">
          <button className="internships-btn" onClick={onGoToInternships}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Find Internships</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <span className="internships-hint">Discover opportunities tailored for you</span>
        </div>

        {/* Divider */}
        <div className="divider" />

        {/* Fields Grid */}
        <div className="fields-grid">
          {fields.map((f) => (
            <div
              key={f.label}
              className={`field-card ${f.wide ? 'field-wide' : ''}`}
            >
              <div className="field-icon">{f.icon}</div>
              <div className="field-content">
                <span className="field-label">{f.label}</span>
                <span className="field-value">{f.value || '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
