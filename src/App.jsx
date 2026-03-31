import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import StudentCity from './components/city/StudentCity';
import MassBunkPage from './components/MassBunkPage';
import NotReadyPage from './components/NotReadyPage';
import InternshipFinder from './components/internship/InternshipFinder';
import AdminDashboard from './components/AdminDashboard';
import { isBITBhilai, extractCollege } from './utils/detectCollege';
import { recordLogin, getCollegeCount } from './utils/collegeTracker';
import './App.css';

// Admin credentials (case-insensitive check)
const ADMIN_NAME = 'divyansh gourha';
const ADMIN_EMAIL = 'whybanned893@gmail.com';

// Check if user is admin
const checkIfAdmin = (name, email) => {
  const normalizedName = (name || '').toLowerCase().trim();
  const normalizedEmail = (email || '').toLowerCase().trim();
  return normalizedName === ADMIN_NAME && normalizedEmail === ADMIN_EMAIL;
};

// LocalStorage key for admin status
const ADMIN_STORAGE_KEY = 'vortex_is_admin';

const API_URL =
  'https://opensheet.elk.sh/15ExPw5ifVM_9IOUlp6eERhvy3BCVTghuLLNhskYEIns/data';

// Helper: Generate UID from email (lowercased)
const generateUID = (email) => {
  return email ? email.trim().toLowerCase() : null;
};

// Helper: Check if user has already responded
const hasUserResponded = (uid) => {
  if (!uid) return false;
  const stored = localStorage.getItem(`vortex_status_${uid}`);
  return stored !== null;
};

// Helper: Get user response data
const getUserResponse = (uid) => {
  if (!uid) return null;
  const stored = localStorage.getItem(`vortex_status_${uid}`);
  return stored ? JSON.parse(stored) : null;
};

// Helper: Save user response
export const saveUserResponse = (uid, agreed) => {
  if (!uid) return;
  localStorage.setItem(`vortex_status_${uid}`, JSON.stringify({
    agreed,
    timestamp: Date.now(),
    uid
  }));
};

// Export helpers for use in other components
export { generateUID, hasUserResponded, getUserResponse };

function App() {
  const [users, setUsers] = useState([]);
  const [usersWithUID, setUsersWithUID] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [screen, setScreen] = useState('login'); // 'login' | 'massbunk' | 'notready' | 'dashboard' | 'internships' | 'admin'
  
  // New states for redirect flow
  const [isFromForm, setIsFromForm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  // Check admin status from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (storedAdmin === 'true') {
      setIsAdmin(true);
      console.log('[App] Admin status restored from localStorage');
    }
  }, []);

  // Detect if user came from Google Form redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromForm = params.get('from') === 'form';
    
    if (fromForm) {
      setIsFromForm(true);
      setShowLoading(true);
      
      // Clean up URL without reloading
      params.delete('from');
      const newUrl = window.location.pathname + (params.toString() ? `?${params.toString()}` : '');
      window.history.replaceState({}, document.title, newUrl);
      
      // Show loading screen for 2.5 seconds, then show login
      setTimeout(() => {
        setShowLoading(false);
        setScreen('login');
      }, 2500);
    } else {
      // Direct visitors see login immediately
      setScreen('login');
    }
  }, []);

  // Fetch user data from Google Sheet and assign UIDs
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data) => {
        // Add UID to each user based on email
        const usersWithUIDs = data.map(user => ({
          ...user,
          uid: generateUID(user['Email Address'])
        }));
        setUsers(data);
        setUsersWithUID(usersWithUIDs);
        setDataLoading(false);
      })
      .catch((err) => {
        setDataError(err.message);
        setDataLoading(false);
      });
  }, []);

  const authenticateUser = (email, name) => {
    const match = usersWithUID.find(
      (u) =>
        u['Email Address']?.trim().toLowerCase() ===
          email.trim().toLowerCase() &&
        u['Full Name']?.trim().toLowerCase() === name.trim().toLowerCase()
    );
    return match || null;
  };

  const handleLogin = (userData) => {
    recordLogin(extractCollege(userData));
    setUser(userData);
    
    // Generate UID for this user
    const uid = generateUID(userData['Email Address']);
    
    // Check if user is admin (case-insensitive)
    const name = userData['Full Name'] || '';
    const email = userData['Email Address'] || '';
    const isUserAdmin = checkIfAdmin(name, email);
    
    if (isUserAdmin) {
      // Set admin status in localStorage and state
      localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setIsAdmin(true);
      console.log('[App] Admin login detected - redirecting to admin dashboard');
      setScreen('admin');
      return;
    }
    
    const bitResult = isBITBhilai(userData);
    console.log('[App] isBITBhilai result:', bitResult, '| college:', extractCollege(userData), '| uid:', uid, '| isAdmin:', isUserAdmin);
    
    if (bitResult) {
      // Check if user has already responded
      if (hasUserResponded(uid)) {
        console.log('[App] User already responded, skipping MassBunkPage');
        setScreen('dashboard');
      } else {
        console.log('[App] Setting screen to massbunk');
        setScreen('massbunk');
      }
    } else {
      console.log('[App] Setting screen to dashboard');
      setScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAdmin(false);
    setScreen('login');
  };

  // Show loading screen if user came from form
  if (showLoading) {
    return (
      <div className="app">
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />
        <LoadingScreen />
      </div>
    );
  }

  // Pure logic injection without destroying existing overlay layers
  let mainContent;
  if (screen === 'login') {
    mainContent = (
      <div className="center-overlay">
        <Login
          onLogin={authenticateUser}
          onSuccess={handleLogin}
          dataLoading={dataLoading}
          dataError={dataError}
          isFromForm={isFromForm}
        />
      </div>
    );
  } else if (screen === 'massbunk') {
    mainContent = (
      <div className="center-overlay">
        <MassBunkPage
          user={user}
          collegeCount={getCollegeCount(extractCollege(user))}
          onYes={() => setScreen('dashboard')}
          onNo={() => setScreen('notready')}
        />
      </div>
    );
  } else if (screen === 'notready') {
    mainContent = (
      <div className="center-overlay">
        <NotReadyPage
          onRetry={() => setScreen('dashboard')}
        />
      </div>
    );
  } else if (screen === 'dashboard') {
    mainContent = (
      <div className="center-overlay">
        <Dashboard user={user} onLogout={handleLogout} onGoToInternships={() => setScreen('internships')} />
      </div>
    );
  } else if (screen === 'internships') {
    mainContent = (
      <InternshipFinder user={user} onLogout={handleLogout} />
    );
  } else if (screen === 'admin') {
    mainContent = (
      <AdminDashboard user={user} onLogout={handleLogout} />
    );
  }

  return (
    <div className="app">
      {/* 3D Student City Background */}
      <StudentCity />

      {/* Dynamic Screen Routing */}
      {mainContent}
    </div>
  );
}

export default App;