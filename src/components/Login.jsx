import { useState } from 'react';

function Login({ onLogin, onSuccess, dataLoading, dataError }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !name.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setChecking(true);

    // Small delay for UX feel
    setTimeout(() => {
      const match = onLogin(email, name);
      if (match) {
        onSuccess(match);
      } else {
        setError('User not found. Please check your name and email.');
      }
      setChecking(false);
    }, 600);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo / Icon */}
        <div className="login-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h1 className="login-title">Intern Finder</h1>
        <p className="login-subtitle">
          Enter your details to access your intern profile
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="fullname">Full Name</label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="fullname"
                type="text"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={dataLoading}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="e.g. john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={dataLoading}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {dataError && (
            <div className="error-message">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Could not load data. Please try again later.
            </div>
          )}

          <button
            type="submit"
            className="login-btn"
            disabled={dataLoading || checking}
          >
            {dataLoading ? (
              <span className="btn-content">
                <span className="spinner" />
                Loading data…
              </span>
            ) : checking ? (
              <span className="btn-content">
                <span className="spinner" />
                Verifying…
              </span>
            ) : (
              <span className="btn-content">
                Sign In
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
              </span>
            )}
          </button>
        </form>

        <p className="login-footer">
          Your data is fetched from a Google Sheet. No passwords stored.
        </p>
      </div>
      <style>{`
        .login-card {
          background: rgba(2, 11, 46, 0.45) !important;
          backdrop-filter: blur(18px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(18px) saturate(160%) !important;
          border: 1px solid rgba(0, 220, 255, 0.25) !important;
          border-radius: 16px !important;
          box-shadow: 0 0 0 1px rgba(0, 200, 255, 0.08), 0 8px 40px rgba(0, 180, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08) !important;
          padding: 40px 36px !important;
        }
        .login-title {
          color: #e8f4ff !important;
          font-weight: 700 !important;
          text-shadow: 0 0 20px rgba(0, 220, 255, 0.4) !important;
        }
        .login-subtitle {
          color: rgba(180, 220, 255, 0.7) !important;
          font-size: 14px !important;
        }
        .input-group label {
          color: rgba(160, 210, 255, 0.9) !important;
          font-size: 13px !important;
          letter-spacing: 0.5px !important;
        }
        .input-wrapper input {
          background: rgba(5, 20, 60, 0.6) !important;
          border: 1px solid rgba(0, 200, 255, 0.2) !important;
          border-radius: 10px !important;
          color: #e8f4ff !important;
          padding: 12px 16px 12px 44px !important;
        }
        .input-wrapper input::placeholder {
          color: rgba(100, 170, 220, 0.5) !important;
        }
        .input-wrapper input:focus {
          border: 1px solid rgba(0, 220, 255, 0.6) !important;
          box-shadow: 0 0 0 3px rgba(0, 200, 255, 0.1) !important;
          outline: none !important;
        }
        .input-icon {
          color: rgba(0, 200, 255, 0.5) !important;
        }
        .login-btn {
          background: linear-gradient(135deg, rgba(0, 180, 255, 0.9), rgba(0, 80, 200, 0.9)) !important;
          border: none !important;
          border-radius: 10px !important;
          color: #ffffff !important;
          font-weight: 600 !important;
          letter-spacing: 1px !important;
          box-shadow: 0 0 20px rgba(0, 180, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15) !important;
          transition: all 0.2s ease !important;
        }
        .login-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(0, 210, 255, 1.0), rgba(0, 100, 220, 1.0)) !important;
          box-shadow: 0 0 35px rgba(0, 200, 255, 0.5) !important;
          transform: translateY(-1px) !important;
        }
        .login-icon {
          background: rgba(0, 180, 255, 0.12) !important;
          border: 1px solid rgba(0, 200, 255, 0.3) !important;
          border-radius: 50% !important;
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.2) !important;
          color: rgba(0, 210, 255, 0.9) !important;
        }
        .login-footer {
          color: rgba(100, 160, 210, 0.5) !important;
          font-size: 12px !important;
        }
      `}</style>
    </div>
  );
}

export default Login;
