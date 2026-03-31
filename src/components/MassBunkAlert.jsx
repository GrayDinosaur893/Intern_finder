import React from 'react';

export default function MassBunkAlert({ onContinue }) {
  return (
    <>
      <style>{`
        .bit-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(6px);
          animation: fadeIn 0.3s ease;
        }
        .bit-modal {
          background: rgba(10, 15, 40, 0.95);
          border: 1px solid rgba(0, 200, 255, 0.25);
          border-radius: 16px;
          padding: 40px 36px;
          max-width: 420px;
          width: 90%;
          text-align: center;
          box-shadow: 0 0 40px rgba(0, 180, 255, 0.15), inset 0 1px 0 rgba(255,255,255,0.05);
          animation: slideUp 0.35s ease;
        }
        .bit-title {
          font-size: 24px;
          font-weight: 700;
          color: #e8f4ff;
          margin-bottom: 16px;
          text-shadow: 0 0 20px rgba(0,220,255,0.4);
        }
        .bit-message {
          font-size: 15px;
          color: rgba(180, 220, 255, 0.75);
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .bit-highlight {
          font-size: 14px;
          font-weight: 600;
          color: #00ccff;
          text-shadow: 0 0 10px rgba(0,200,255,0.5);
          margin-bottom: 28px;
          display: block;
        }
        .bit-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00b4ff, #0050c8);
          border: none;
          border-radius: 10px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,180,255,0.3);
          transition: all 0.2s ease;
        }
        .bit-btn:hover {
          background: linear-gradient(135deg, #00d2ff, #0064dc);
          box-shadow: 0 0 35px rgba(0,200,255,0.5);
          transform: translateY(-1px);
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }
      `}</style>
      <div className="bit-overlay">
        <div className="bit-modal">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</div>
          <div className="bit-title">Mass Bunk Insights</div>
          <div className="bit-message">
            High participation detected from your college. Many students are exploring internship opportunities during class hours.
          </div>
          <span className="bit-highlight">You are part of this trend.</span>
          <button className="bit-btn" onClick={onContinue}>
            Continue to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}
