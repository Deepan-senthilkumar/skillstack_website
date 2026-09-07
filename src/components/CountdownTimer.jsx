import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

export default function CountdownTimer({ deadline, onExpire }) {
  const calculateRemaining = () => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    return Math.max(0, Math.floor(diff / 1000));
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateRemaining);

  useEffect(() => {
    if (!deadline) return;

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  if (!deadline) {
    return (
      <span className="countdown-box" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)', borderColor: 'var(--border-subtle)' }}>
        <Clock size={13} /> No deadline set
      </span>
    );
  }

  if (secondsLeft === 0) {
    return (
      <span className="countdown-box" style={{ background: 'var(--coral-soft)', color: 'var(--coral)', borderColor: 'rgba(224,108,117,0.3)' }}>
        <AlertCircle size={13} /> Deadline Expired
      </span>
    );
  }

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const pad = (n) => String(n).padStart(2, '0');

  let text = '';
  if (days > 0) {
    text = `${days}d ${pad(hours)}h ${pad(mins)}m`;
  } else {
    text = `${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
  }

  return (
    <span className="countdown-box" title={`Deadline: ${new Date(deadline).toLocaleString()}`}>
      <Clock size={13} className="spin-slow" /> Closes in {text}
    </span>
  );
}
