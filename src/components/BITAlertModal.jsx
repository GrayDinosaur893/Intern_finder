import { useState, useEffect } from 'react';

function BITAlertModal({ user, onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay for dramatic effect
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onContinue, 300);
  };

  return (
    <div
      className={`bit-alert-overlay ${visible ? 'visible' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`bit-alert-modal ${visible ? 'visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bit-alert-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2 className="bit-alert-title">Special Notice</h2>
        <p className="bit-alert-message">
          BIT Bhilai students detected. Additional insights unlocked.
        </p>

        <p className="bit-alert-user">
          Welcome, <strong>{user?.['Full Name'] || 'Student'}</strong>
        </p>

        <button className="bit-alert-button" onClick={handleClose}>
          Continue
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
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default BITAlertModal;