import React, { useEffect, useState } from 'react';

function NotReadyPage({ onRetry }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
  }, []);

  return (
    <div style={styles.page}>
      <div className={`notready-card ${animating ? 'fade-in' : ''}`} style={styles.card}>
        <div style={styles.emoji}>🕐</div>

        <h1 style={styles.title}>
          No worries.
        </h1>

        <p style={styles.message}>
          Internships will still be here when you are ready.
          Come back whenever you want to explore opportunities.
        </p>

        <p style={styles.note}>
          Most students who come back within the same session
          end up applying. Just saying. 👀
        </p>

        <button 
          style={styles.button}
          onClick={onRetry}
        >
          Actually, Show Me Internships →
        </button>

        <div 
          style={styles.backLink}
          onClick={() => window.location.reload()}
        >
          ← Back to Login
        </div>
      </div>

      <style>{`
        .notready-card {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.5s ease-out;
        }

        .notready-card.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    background: 'linear-gradient(135deg, #020b2e 0%, #0a1628 50%, #020b2e 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  },
  emoji: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#e8f4ff',
    margin: '0 0 16px',
  },
  message: {
    color: 'rgba(180, 220, 255, 0.75)',
    lineHeight: '1.8',
    margin: '0 0 16px',
  },
  note: {
    fontSize: '13px',
    color: 'rgba(0, 200, 255, 0.5)',
    margin: '16px 0 32px',
  },
  button: {
    background: 'linear-gradient(135deg, #00b4ff, #0050c8)',
    color: '#ffffff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 0 25px rgba(0,180,255,0.35)',
    transition: 'all 0.2s ease',
  },
  backLink: {
    color: 'rgba(100,150,200,0.4)',
    fontSize: '12px',
    cursor: 'pointer',
    marginTop: '32px',
    transition: 'color 0.2s ease',
  },
};

export default NotReadyPage;