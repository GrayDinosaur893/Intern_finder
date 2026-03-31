import React, { useState, useEffect } from 'react';
import { extractCollege } from '../utils/detectCollege';
import { getUserResponse } from '../App';

const AGREED_USERS_KEY = 'massbunk_agreed_users';
const DISAGREED_USERS_KEY = 'massbunk_disagreed_users';

function AdminDashboard({ user, onLogout }) {
  const [loyalists, setLoyalists] = useState([]);
  const [formalists, setFormalists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ADMIN_NAME = 'Divyansh Gourha';
  const ADMIN_EMAIL = 'whybanned893@gmail.com';

  // Check if user is authorized
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

    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Collect all responses from localStorage using UID system
      const loyalistsList = [];
      const formalistsList = [];
      
      // Check all localStorage keys for vortex_status_ prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('vortex_status_')) {
          const uid = key.replace('vortex_status_', '');
          const response = getUserResponse(uid);
          if (response) {
            const entry = {
              uid: uid,
              agreed: response.agreed,
              timestamp: response.timestamp,
              email: uid // UID is the email
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
      setError('Failed to load response data.');
      setLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      loyalists,
      formalists,
      timestamp: new Date().toISOString(),
      totalResponses: loyalists.length + formalists.length
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `massbunk_responses_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isAuthorized()) {
    return (
      <div className="admin-dashboard unauthorized">
        <div className="unauthorized-content">
          <h1>🚫 Access Denied</h1>
          <p>You are not authorized to view this page.</p>
          <p>Required: Name: Divyansh Gourha, Email: whybanned893@gmail.com</p>
          <button className="btn-logout" onClick={onLogout}>Go Back</button>
        </div>
        <style>{`
          .admin-dashboard.unauthorized {
            background: linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .unauthorized-content {
            background: rgba(255, 0, 0, 0.1);
            border: 2px solid rgba(255, 0, 0, 0.4);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 100%;
            color: #ffcccc;
          }
          .unauthorized-content h1 {
            font-size: 48px;
            margin-bottom: 20px;
            color: #ff3333;
          }
          .unauthorized-content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
          }
          .btn-logout {
            background: transparent;
            border: 2px solid rgba(255, 0, 0, 0.5);
            color: #ff3333;
            padding: 12px 24px;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .btn-logout:hover {
            background: rgba(255, 0, 0, 0.1);
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🛡️ Commander's Dashboard</h1>
        <p>Welcome, Divyansh Gourha</p>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card loyalists">
          <h3>🔥 The Loyalists</h3>
          <div className="stat-number">{loyalists.length}</div>
          <p>Students who agreed to bunk</p>
        </div>
        <div className="stat-card formalists">
          <h3>⚠️ The Formalists</h3>
          <div className="stat-number">{formalists.length}</div>
          <p>Students who disagreed</p>
        </div>
        <div className="stat-card total">
          <h3>📊 Total Responses</h3>
          <div className="stat-number">{loyalists.length + formalists.length}</div>
          <p>Total students who responded</p>
        </div>
      </div>

      <div className="admin-content">
        <div className="response-list">
          <div className="list-header loyalists">
            <h2>🔥 The Loyalists ({loyalists.length})</h2>
            <button className="btn-export" onClick={exportData}>Export All Data</button>
          </div>
          {loading ? (
            <div className="loading">Loading responses...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : loyalists.length === 0 ? (
            <div className="empty-state">No loyalists yet. Keep rallying the troops!</div>
          ) : (
            <div className="student-grid">
              {loyalists.map((student, index) => (
                <div key={index} className="student-card loyalist">
                  <div className="student-name">🔥 Loyalist #{index + 1}</div>
                  <div className="student-email student-uid">UID: {student.uid}</div>
                  <div className="student-email">{student.email}</div>
                  <div className="student-time">{new Date(student.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="response-list">
          <div className="list-header formalists">
            <h2>⚠️ The Formalists ({formalists.length})</h2>
          </div>
          {loading ? (
            <div className="loading">Loading responses...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : formalists.length === 0 ? (
            <div className="empty-state">No formalists yet. Everyone's on board!</div>
          ) : (
            <div className="student-grid">
              {formalists.map((student, index) => (
                <div key={index} className="student-card formalist">
                  <div className="student-name">⚠️ Formalist #{index + 1}</div>
                  <div className="student-email student-uid">UID: {student.uid}</div>
                  <div className="student-email">{student.email}</div>
                  <div className="student-time">{new Date(student.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          background: linear-gradient(135deg, #020b2e 0%, #0a1628 50%, #020b2e 100%);
          min-height: 100vh;
          padding: 20px;
        }
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 180, 255, 0.2);
        }
        .admin-header h1 {
          color: #e8f4ff;
          font-size: 32px;
          margin: 0;
          text-shadow: 0 0 20px rgba(0, 180, 255, 0.4);
        }
        .admin-header p {
          color: rgba(150, 200, 255, 0.7);
          margin: 0;
          font-size: 14px;
        }
        .btn-logout {
          background: linear-gradient(135deg, #8a2be2, #4b0082);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-logout:hover {
          box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
          transform: translateY(-1px);
        }
        
        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        .stat-card h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: rgba(150, 200, 255, 0.8);
        }
        .stat-card.loyalists h3 { color: #ffcc00; }
        .stat-card.formalists h3 { color: #ff6b6b; }
        .stat-card.total h3 { color: #00b4ff; }
        .stat-number {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 5px;
        }
        .stat-card.loyalists .stat-number { color: #ffcc00; }
        .stat-card.formalists .stat-number { color: #ff6b6b; }
        .stat-card.total .stat-number { color: #00b4ff; }
        .stat-card p {
          margin: 0;
          font-size: 12px;
          color: rgba(150, 200, 255, 0.6);
        }

        .admin-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }
        
        .response-list {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 20px;
        }
        
        .list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .list-header h2 {
          margin: 0;
          color: #e8f4ff;
          font-size: 20px;
        }
        .list-header.loyalists h2 { color: #ffcc00; }
        .list-header.formalists h2 { color: #ff6b6b; }
        
        .btn-export {
          background: linear-gradient(135deg, #00b4ff, #0050c8);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-export:hover {
          box-shadow: 0 0 15px rgba(0, 180, 255, 0.4);
        }

        .student-grid {
          display: grid;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .student-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 12px;
          transition: all 0.2s ease;
        }
        .student-card:hover {
          transform: translateX(4px);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .student-card.loyalist {
          border-left: 4px solid #ffcc00;
        }
        .student-card.formalist {
          border-left: 4px solid #ff6b6b;
        }
        
        .student-name {
          font-weight: 700;
          color: #e8f4ff;
          font-size: 14px;
        }
        .student-email {
          color: rgba(150, 200, 255, 0.7);
          font-size: 12px;
          margin: 4px 0;
        }
        .student-time {
          color: rgba(100, 160, 210, 0.5);
          font-size: 11px;
        }
        
        .loading, .error, .empty-state {
          text-align: center;
          padding: 40px;
          color: rgba(150, 200, 255, 0.7);
          font-size: 14px;
        }
        .error {
          color: #ff6b6b;
        }
        
        @media (max-width: 768px) {
          .admin-content {
            grid-template-columns: 1fr;
          }
          .admin-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;