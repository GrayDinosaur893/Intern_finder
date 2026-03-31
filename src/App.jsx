import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import StudentCity from './components/city/StudentCity';
import MassBunkPage from './components/MassBunkPage';
import NotReadyPage from './components/NotReadyPage';
import InternshipFinder from './components/internship/InternshipFinder';
import { isBITBhilai, extractCollege } from './utils/detectCollege';
import { recordLogin, getCollegeCount } from './utils/collegeTracker';
import './App.css';

const API_URL =
  'https://opensheet.elk.sh/15ExPw5ifVM_9IOUlp6eERhvy3BCVTghuLLNhskYEIns/data';

function App() {
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login'); // 'login' | 'massbunk' | 'notready' | 'dashboard' | 'internships'
  
  // New states for redirect flow
  const [isFromForm, setIsFromForm] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

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

  // Fetch user data from Google Sheet
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setDataLoading(false);
      })
      .catch((err) => {
        setDataError(err.message);
        setDataLoading(false);
      });
  }, []);

  const authenticateUser = (email, name) => {
    const match = users.find(
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
    const bitResult = isBITBhilai(userData);
    console.log('[App] isBITBhilai result:', bitResult, '| college:', extractCollege(userData));
    if (bitResult) {
      console.log('[App] Setting screen to massbunk');
      setScreen('massbunk');
    } else {
      console.log('[App] Setting screen to dashboard');
      setScreen('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
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