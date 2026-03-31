import React, { useEffect, useState, useRef } from 'react';
import { extractCollege } from '../utils/detectCollege';
import { getCollegeCount } from '../utils/collegeTracker';

const AGREED_COUNT_KEY = 'massbunk_agreed_count';
const AGREED_USERS_KEY = 'massbunk_agreed_users';

function MassBunkPage({ user, collegeCount, onYes, onNo }) {
  const [animating, setAnimating] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [agreedCount, setAgreedCount] = useState(0);
  const [hasAgreed, setHasAgreed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setAnimating(true);
    // Load agreed count
    const stored = localStorage.getItem(AGREED_COUNT_KEY);
    setAgreedCount(stored ? parseInt(stored) : 0);
    
    // Check if current user has already agreed
    const userId = user?.['Email Address']?.toLowerCase().trim();
    if (userId) {
      const agreedUsers = JSON.parse(localStorage.getItem(AGREED_USERS_KEY) || '[]');
      setHasAgreed(agreedUsers.includes(userId));
    }
  }, [user]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    console.log('Scroll debug:', { clientHeight: container.clientHeight, scrollHeight: container.scrollHeight });
  }, []);

  const collegeName = extractCollege(user) || 'Your College';
  const userName = user?.['Full Name'] || 'Student';

  const numberToWords = (num) => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    if (num === 0) return 'zero';
    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      return ones[hundred] + ' hundred' + (remainder !== 0 ? ' and ' + numberToWords(remainder) : '');
    }
    return num.toString();
  };

  const handleAgree = () => {
    const userId = user?.['Email Address']?.toLowerCase().trim();
    
    // Check if user has already agreed - don't increment if same ID
    if (userId) {
      const agreedUsers = JSON.parse(localStorage.getItem(AGREED_USERS_KEY) || '[]');
      
      // If already agreed, just navigate without incrementing
      if (agreedUsers.includes(userId)) {
        if (onYes) onYes();
        return;
      }
      
      // Record this user as agreed
      agreedUsers.push(userId);
      localStorage.setItem(AGREED_USERS_KEY, JSON.stringify(agreedUsers));
    }
    
    // Increment count only for new unique users
    const newCount = agreedCount + 1;
    setAgreedCount(newCount);
    localStorage.setItem(AGREED_COUNT_KEY, newCount.toString());
    setHasAgreed(true);
    
    if (onYes) onYes();
  };

  const handleDisagree = () => {
    setShowWarning(true);
    if (onNo) onNo();
  };

  if (showWarning) {
    return (
      <div className="massbunk-page warning-active">
        <div className="warning-protocol">
          <div className="warning-header">
            <div className="warning-icon pulse">⚠️</div>
            <h1 className="warning-title">WARNING PROTOCOL ACTIVE</h1>
          </div>
          <div className="warning-content">
            <div className="warning-message">
              <p className="warning-text">Anyone who disagrees with this decision…<br />or lacks the will to stand with us—</p>
              <p className="warning-highlight">You are advised to step back now.</p>
              <p className="warning-danger">Because you may be in danger right now.<br /><span className="warning-spyware">Maybe I can introduce a spyware spy… please collaborate.</span></p>
              <p className="warning-final">There is no turning back.</p>
            </div>
            
            {/* GIF for disagreement */}
            <div className="gif-container">
              <img src="/angry-thiago-mad.gif" alt="Angry Thiago" className="disagreement-gif" />
              <p className="gif-caption">No worries when someone disagrees</p>
            </div>
            <div className="warning-count">
              <div className="count-number">{agreedCount}</div>
              <div className="count-text">students have already agreed</div>
            </div>
            <div className="warning-buttons">
              <button className="btn-join" onClick={handleAgree}>Wait — I Want to Join Them</button>
            </div>
          </div>
          <div className="warning-footer">
            <div className="warning-status"><span className="status-dot"></span>PROTOCOL ENFORCED</div>
          </div>
        </div>
        <style>{`
          .massbunk-page.warning-active { background: linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; animation: warningFlash 0.5s ease-in-out infinite alternate; }
          @keyframes warningFlash { from { background: linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%); } to { background: linear-gradient(135deg, #250000 0%, #3d0f0f 50%, #250000 100%); } }
          .warning-protocol { background: rgba(255, 0, 0, 0.05); border: 2px solid rgba(255, 0, 0, 0.4); border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 0 60px rgba(255, 0, 0, 0.3); animation: warningSlideIn 0.5s ease-out; }
          @keyframes warningSlideIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
          .warning-header { margin-bottom: 30px; }
          .warning-icon { font-size: 60px; margin-bottom: 16px; display: block; }
          .warning-icon.pulse { animation: pulse 1s ease-in-out infinite; }
          @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.2); opacity: 0.8; } }
          .warning-title { font-size: 28px; font-weight: 900; color: #ff3333; text-shadow: 0 0 20px rgba(255, 0, 0, 0.8); letter-spacing: 3px; margin: 0; }
          .warning-message { margin: 20px 0; }
          .warning-text { font-size: 16px; color: rgba(255, 150, 150, 0.9); line-height: 1.8; margin-bottom: 16px; }
          .warning-highlight { font-size: 20px; font-weight: 700; color: #ff5555; text-shadow: 0 0 10px rgba(255, 0, 0, 0.5); margin: 20px 0; }
          .warning-danger { font-size: 15px; color: rgba(255, 100, 100, 0.8); line-height: 1.8; margin: 20px 0; }
          .warning-spyware { color: #ff0000; font-weight: 700; text-shadow: 0 0 15px rgba(255, 0, 0, 0.6); animation: spywareGlow 1s ease-in-out infinite alternate; }
          @keyframes spywareGlow { from { opacity: 0.7; } to { opacity: 1; } }
          .warning-final { font-size: 22px; font-weight: 800; color: #ff4444; text-shadow: 0 0 20px rgba(255, 0, 0, 0.7); margin-top: 30px; letter-spacing: 2px; }
          
          /* GIF styles for disagreement */
          .gif-container { margin: 20px 0; padding: 16px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 12px; text-align: center; }
          .disagreement-gif { max-width: 200px; height: auto; border-radius: 8px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.5); }
          .gif-caption { font-size: 12px; color: rgba(255, 150, 150, 0.8); margin-top: 8px; font-style: italic; }
          
          .warning-count { background: rgba(255, 0, 0, 0.1); border: 1px solid rgba(255, 0, 0, 0.3); border-radius: 12px; padding: 16px; margin: 30px auto; display: inline-block; min-width: 200px; }
          .count-number { font-size: 36px; font-weight: 900; color: #ff3333; text-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
          .count-text { font-size: 13px; color: rgba(255, 150, 150, 0.8); margin-top: 4px; }
          .warning-buttons { margin-top: 30px; }
          .btn-join { background: transparent; border: 2px solid rgba(0, 255, 100, 0.5); color: #00ff64; padding: 14px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
          .btn-join:hover { background: rgba(0, 255, 100, 0.1); box-shadow: 0 0 25px rgba(0, 255, 100, 0.3); transform: translateY(-2px); }
          .warning-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255, 0, 0, 0.2); }
          .warning-status { font-size: 11px; color: rgba(255, 100, 100, 0.6); letter-spacing: 2px; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .status-dot { width: 8px; height: 8px; background: #ff0000; border-radius: 50%; animation: dotPulse 1.5s ease-in-out infinite; }
          @keyframes dotPulse { 0%, 100% { opacity: 1; box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); } 50% { opacity: 0.3; box-shadow: none; } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="massbunk-page h-screen flex items-center justify-center overflow-hidden">
      <div className={`massbunk-card ${animating ? 'fade-in' : ''}`} style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div ref={containerRef} className="massbunk-inner" style={{ height: '65vh', minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div className="massbunk-content-wrapper">
            {/* Date Banner */}
            <div className="date-banner">
              <div className="date-icon">📅</div>
              <div className="date-text">
                <span className="date-label">UPCOMING SATURDAY</span>
                <span className="date-day">4TH APRIL</span>
              </div>
            </div>

            {/* Header */}
            <div className="notice-header">
              <h1>Subject: Collective Student Action – Academic Pause on Upcoming Saturday</h1>
            </div>

            {/* Intro */}
            <div className="notice-intro">
              <p>Dear Students,</p>
              <p>This notice is to formally inform you of a proposed collective academic pause scheduled for <strong>Saturday (upcoming)</strong>.</p>
              <p>The purpose of this action is not indiscipline, but reflection—on how effectively our current academic routines translate into meaningful career outcomes.</p>
            </div>

            {/* Placement Reality Check */}
            <div className="section placement-reality">
              <h2>📊 Placement Reality Check (3rd Tier Colleges)</h2>
              <p className="section-subtitle">Based on aggregated reports and placement trends across Tier-3 engineering institutions in India:</p>
              <div className="stats-table">
                <div className="table-row header">
                  <div className="table-cell">Metric</div>
                  <div className="table-cell">Estimated Range</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">Students with near 100% attendance placed</div>
                  <div className="table-cell highlight">10% – 25%</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">Overall placement rate (average colleges)</div>
                  <div className="table-cell">40% – 65%</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">Students placed in high-paying roles (≥6 LPA)</div>
                  <div className="table-cell highlight">5% – 15%</div>
                </div>
                <div className="table-row">
                  <div className="table-cell">Students relying on self-learning/off-campus</div>
                  <div className="table-cell highlight">50%+</div>
                </div>
              </div>
            </div>

            {/* Key Observations */}
            <div className="section observations">
              <h2>📌 Key Observations</h2>
              <div className="observation">
                <strong>1. Attendance alone is not a strong predictor of placement success.</strong>
                <p>Recruiters prioritize:</p>
                <ul>
                  <li>Skills (development, problem-solving)</li>
                  <li>Internships & projects</li>
                  <li>Communication ability</li>
                </ul>
              </div>
              <div className="observation">
                <strong>2. A large proportion of successful students rely on self-driven learning,</strong> often outside classroom hours.
              </div>
              <div className="observation">
                <strong>3. Rigid academic attendance does not proportionally increase placement probability,</strong> especially in Tier-3 institutions.
              </div>
            </div>

            {/* Purpose */}
            <div className="section purpose">
              <h2>🎯 Purpose of This Action</h2>
              <p>This is not an act of negligence.</p>
              <p>It is intended to:</p>
              <ul>
                <li>Encourage students to <strong>re-evaluate learning strategies</strong></li>
                <li>Promote <strong>skill-based growth over passive attendance</strong></li>
                <li>Create awareness of <strong>actual placement dynamics</strong></li>
              </ul>
            </div>

            {/* Important Note */}
            <div className="section important-note">
              <h2>⚖️ Important Note</h2>
              <p>Participation is entirely voluntary.<br />Students should act responsibly and remain aware of academic policies.</p>
            </div>

            {/* Final Thought */}
            <div className="section final-thought">
              <h2>🧠 Final Thought</h2>
              <p className="quote">A single day does not define discipline.<br />But it can redefine direction.</p>
            </div>

            {/* Footer */}
            <div className="notice-footer">
              <div className="footer-info">
                <span><strong>Proposed Date:</strong> Saturday (Upcoming)</span>
                <span><strong>Action:</strong> Academic Pause (Mass Bunk)</span>
              </div>
              <p className="footer-message">Let this be not an escape from responsibility—but a step toward owning it.</p>
            </div>

            {/* Agreement Section */}
            <div className="agreement-section">
              <div className="agreement-prompt">Will you stand with us?</div>
              <div className="agreed-text"><span className="count-highlight">{numberToWords(agreedCount)}</span> students have already agreed</div>
              {hasAgreed && <div className="already-agreed-badge">✓ You have already agreed</div>}
              <div className="button-group">
                <button className="btn-yes" onClick={handleAgree} disabled={hasAgreed}>Yes — I Stand With You</button>
                <button className="btn-no" onClick={handleDisagree}>No — I Disagree</button>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .massbunk-page { background: linear-gradient(135deg, #020b2e 0%, #0a1628 50%, #020b2e 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
          .massbunk-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 0; max-width: 700px; width: 100%; text-align: left; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); opacity: 0; transform: translateY(30px); transition: all 0.6s ease-out; overflow: hidden; }
          .massbunk-card.fade-in { opacity: 1; transform: translateY(0); }
          .massbunk-inner { padding: 30px 35px; scroll-behavior: smooth; }
          .massbunk-inner::-webkit-scrollbar { width: 6px; }
          .massbunk-inner::-webkit-scrollbar-thumb { background: rgba(0, 180, 255, 0.5); border-radius: 10px; }
          .massbunk-inner::-webkit-scrollbar-track { background: transparent; }
          .massbunk-content-wrapper { display: flex; flex-direction: column; gap: 20px; }
          .date-banner { display: flex; align-items: center; justify-content: center; gap: 16px; padding: 20px; background: linear-gradient(135deg, rgba(255, 204, 0, 0.15), rgba(255, 165, 0, 0.1)); border: 2px solid rgba(255, 204, 0, 0.4); border-radius: 16px; margin-bottom: 10px; box-shadow: 0 0 30px rgba(255, 204, 0, 0.2); animation: datePulse 2s ease-in-out infinite; }
          @keyframes datePulse { 0%, 100% { box-shadow: 0 0 30px rgba(255, 204, 0, 0.2); } 50% { box-shadow: 0 0 50px rgba(255, 204, 0, 0.4); } }
          .date-icon { font-size: 48px; }
          .date-text { display: flex; flex-direction: column; }
          .date-label { font-size: 14px; font-weight: 600; color: rgba(255, 204, 0, 0.8); letter-spacing: 2px; }
          .date-day { font-size: 32px; font-weight: 900; color: #ffcc00; text-shadow: 0 0 20px rgba(255, 204, 0, 0.6); letter-spacing: 3px; }
          .notice-header h1 { font-size: 20px; font-weight: 700; color: #00b4ff; text-shadow: 0 0 15px rgba(0, 180, 255, 0.4); margin: 0 0 16px; line-height: 1.4; }
          .notice-intro { color: rgba(200, 220, 255, 0.85); font-size: 14px; line-height: 1.8; }
          .notice-intro p { margin: 8px 0; }
          .section { margin: 16px 0; }
          .section h2 { font-size: 16px; font-weight: 700; color: #e8f4ff; margin: 0 0 12px; }
          .section-subtitle { font-size: 12px; color: rgba(150, 200, 255, 0.7); margin-bottom: 12px; font-style: italic; }
          .stats-table { border: 1px solid rgba(0, 180, 255, 0.2); border-radius: 8px; overflow: hidden; }
          .table-row { display: flex; border-bottom: 1px solid rgba(0, 180, 255, 0.1); }
          .table-row:last-child { border-bottom: none; }
          .table-row.header { background: rgba(0, 180, 255, 0.1); }
          .table-cell { padding: 10px 12px; font-size: 13px; }
          .table-cell:first-child { flex: 2; color: rgba(200, 220, 255, 0.85); border-right: 1px solid rgba(0, 180, 255, 0.1); }
          .table-cell:last-child { flex: 1; text-align: center; font-weight: 600; color: #00b4ff; }
          .table-cell.highlight { color: #ffcc00; }
          .observations .observation { background: rgba(0, 180, 255, 0.03); border-left: 3px solid #00b4ff; padding: 12px; margin: 10px 0; border-radius: 0 8px 8px 0; }
          .observations .observation strong { color: #00b4ff; font-size: 13px; }
          .observations .observation p { color: rgba(200, 220, 255, 0.75); font-size: 13px; margin: 6px 0 0; }
          .observations .observation ul { margin: 6px 0 0 16px; padding: 0; }
          .observations .observation li { color: rgba(200, 220, 255, 0.75); font-size: 13px; margin: 4px 0; }
          .purpose ul { margin: 8px 0 0 16px; padding: 0; }
          .purpose li { color: rgba(200, 220, 255, 0.8); font-size: 13px; margin: 6px 0; }
          .purpose strong { color: #00b4ff; }
          .important-note { background: rgba(255, 204, 0, 0.05); border: 1px solid rgba(255, 204, 0, 0.2); border-radius: 8px; padding: 12px; }
          .important-note h2 { color: #ffcc00; }
          .important-note p { color: rgba(200, 220, 255, 0.8); font-size: 13px; line-height: 1.6; }
          .final-thought .quote { font-size: 16px; font-weight: 700; color: #00b4ff; text-shadow: 0 0 15px rgba(0, 180, 255, 0.5); font-style: italic; text-align: center; padding: 16px; background: rgba(0, 180, 255, 0.05); border-radius: 8px; }
          .notice-footer { border-top: 1px solid rgba(0, 180, 255, 0.15); padding-top: 16px; margin-top: 8px; }
          .footer-info { display: flex; gap: 24px; font-size: 13px; color: rgba(200, 220, 255, 0.7); }
          .footer-info span { display: block; margin: 4px 0; }
          .footer-message { font-size: 14px; color: #e8f4ff; font-style: italic; text-align: center; margin-top: 16px; }
          .agreement-section { border-top: 1px solid rgba(0, 180, 255, 0.15); padding-top: 20px; margin-top: 16px; text-align: center; }
          .agreement-prompt { font-size: 18px; font-weight: 700; color: #e8f4ff; margin-bottom: 12px; }
          .agreed-text { font-size: 13px; color: rgba(150, 200, 255, 0.8); margin-bottom: 20px; }
          .count-highlight { color: #00b4ff; font-weight: 700; font-size: 15px; }
          .already-agreed-badge { color: #00ff64; font-size: 13px; margin-bottom: 16px; padding: 8px 16px; background: rgba(0, 255, 100, 0.1); border: 1px solid rgba(0, 255, 100, 0.3); border-radius: 8px; display: inline-block; }
          .btn-yes { background: linear-gradient(135deg, #00b4ff, #0050c8); color: #ffffff; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; border: none; cursor: pointer; box-shadow: 0 0 20px rgba(0, 180, 255, 0.4); transition: all 0.2s ease; opacity: 0; animation: slideIn 0.3s ease 0.3s forwards; }
          .btn-yes:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
          .btn-yes:hover { box-shadow: 0 0 35px rgba(0, 180, 255, 0.6); transform: translateY(-2px); }
          .button-group { display: flex; gap: 12px; justify-content: center; }
          .btn-no { background: transparent; border: 1px solid rgba(255, 100, 100, 0.3); color: rgba(255, 150, 150, 0.6); padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; opacity: 0; animation: slideIn 0.3s ease 0.5s forwards; }
          .btn-no:hover { border-color: rgba(255, 100, 100, 0.6); color: rgba(255, 150, 150, 0.9); background: rgba(255, 0, 0, 0.05); }
          @keyframes slideIn { to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}

export default MassBunkPage;