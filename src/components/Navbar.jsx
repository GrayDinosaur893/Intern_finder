import React, { useState } from 'react';

function Navbar({ user, isAdmin, screen, onNavigate, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠', show: true },
    { id: 'internships', label: 'Internships', icon: '💼', show: true },
    { id: 'admin', label: 'Admin', icon: '🛡️', show: isAdmin },
  ].filter(item => item.show);

  const initials = user?.['Full Name']
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <>
      <nav className="vortex-navbar">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          <div className="logo-icon">⚡</div>
          <span className="logo-text">Vortex</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-link ${screen === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {screen === item.id && <span className="nav-active-dot" />}
            </button>
          ))}
        </div>

        {/* Right side: user info + logout */}
        <div className="navbar-right">
          <div className="navbar-user">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <span className="user-name-nav">{user?.['Full Name'] || 'User'}</span>
              {isAdmin && <span className="admin-badge">ADMIN</span>}
            </div>
          </div>
          <button className="nav-logout-btn" onClick={onLogout} title="Logout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-label">Logout</span>
          </button>

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-line ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`mobile-nav-link ${screen === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); setMenuOpen(false); }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button className="mobile-nav-link logout" onClick={() => { onLogout(); setMenuOpen(false); }}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}

      <style>{`
        .vortex-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          background: rgba(2, 11, 46, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 180, 255, 0.15);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
        }

        /* Logo */
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
        }
        .logo-icon {
          font-size: 22px;
          filter: drop-shadow(0 0 8px rgba(0, 200, 255, 0.8));
        }
        .logo-text {
          font-size: 18px;
          font-weight: 800;
          color: #e8f4ff;
          letter-spacing: 1px;
          text-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
        }

        /* Nav Links */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: rgba(150, 200, 255, 0.7);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          letter-spacing: 0.3px;
        }
        .nav-link:hover {
          background: rgba(0, 180, 255, 0.1);
          color: #e8f4ff;
        }
        .nav-link.active {
          background: rgba(0, 180, 255, 0.15);
          color: #00d4ff;
          font-weight: 600;
        }
        .nav-icon {
          font-size: 14px;
        }
        .nav-active-dot {
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background: #00d4ff;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(0, 212, 255, 0.8);
        }

        /* Right side */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(0, 180, 255, 0.3), rgba(0, 80, 200, 0.4));
          border: 1px solid rgba(0, 200, 255, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #00d4ff;
          box-shadow: 0 0 10px rgba(0, 180, 255, 0.2);
          flex-shrink: 0;
        }
        .user-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .user-name-nav {
          font-size: 13px;
          font-weight: 600;
          color: #e8f4ff;
          white-space: nowrap;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .admin-badge {
          font-size: 9px;
          font-weight: 700;
          color: #ffcc00;
          background: rgba(255, 204, 0, 0.15);
          border: 1px solid rgba(255, 204, 0, 0.3);
          border-radius: 4px;
          padding: 1px 5px;
          letter-spacing: 1px;
          width: fit-content;
        }
        .nav-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          border: 1px solid rgba(255, 100, 100, 0.25);
          background: transparent;
          color: rgba(255, 130, 130, 0.7);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-logout-btn:hover {
          background: rgba(255, 0, 0, 0.08);
          border-color: rgba(255, 100, 100, 0.5);
          color: #ff8080;
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .ham-line {
          display: block;
          width: 22px;
          height: 2px;
          background: rgba(150, 200, 255, 0.8);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 60px;
          left: 0;
          right: 0;
          z-index: 999;
          background: rgba(2, 11, 46, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 180, 255, 0.15);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: rgba(150, 200, 255, 0.8);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: rgba(0, 180, 255, 0.1);
          color: #e8f4ff;
        }
        .mobile-nav-link.logout {
          color: rgba(255, 130, 130, 0.7);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          margin-top: 4px;
          padding-top: 16px;
        }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .user-info { display: none; }
          .nav-logout-btn .logout-label { display: none; }
          .nav-logout-btn { padding: 7px 10px; }
          .hamburger { display: flex; }
        }
@media (max-width: 480px) {
  .nav-logout-btn { display: none; }
  .vortex-navbar { padding: 0 16px; }
  .vortex-navbar { height: 50px; }
}
      `}</style>
    </>
  );
}

export default Navbar;
