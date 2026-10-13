import React, { useState, useEffect } from 'react';
import { Shield, X, Cookie } from 'lucide-react';

export default function CookieConsentBanner({ onNavigate }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('skillstack_cookie_consent');
      if (!consent) {
        // Show after a brief delay so page loads smoothly
        const timer = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('skillstack_cookie_consent', 'accepted');
    } catch {
      // Ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '18px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 'calc(100% - 36px)',
      maxWidth: '760px',
      zIndex: 99999,
      background: '#0F172A',
      color: '#FFFFFF',
      borderRadius: '20px',
      padding: '18px 24px',
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)',
      border: '1.5px solid rgba(255, 255, 255, 0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: '1 1 360px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: '#FDC029'
        }}>
          <Cookie size={20} />
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', marginBottom: '2px' }}>
            Cookie &amp; Advertising Notice
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.5 }}>
            We use cookies to analyze site traffic, persist your coding lab state, and serve relevant advertisements through <strong>Google AdSense</strong>. Learn more in our{' '}
            <button
              onClick={() => onNavigate && onNavigate('privacy-policy')}
              style={{
                background: 'none',
                border: 'none',
                color: '#E879F9',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Privacy Policy
            </button>.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleAccept}
          style={{
            background: 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '12.5px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(123, 28, 110, 0.35)'
          }}
        >
          Accept Cookies
        </button>

        <button
          onClick={() => setVisible(false)}
          title="Dismiss banner"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
