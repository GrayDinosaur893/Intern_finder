import { useState, useEffect } from 'react';

const messages = [
  'Processing your application...',
  'Analyzing your profile...',
  'Preparing your dashboard...',
];

function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${visible ? 'visible' : 'hidden'}`}>
      <div className="loading-content">
        <div className="loading-spinner">
          <svg
            width="48"
            height="48"
            viewBox="0 0 50 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              strokeOpacity="0.2"
            />
            <path
              d="M25 5 A20 20 0 0 1 45 25"
              className="loading-arc"
            />
          </svg>
        </div>
        <p className="loading-message">{messages[messageIndex]}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;