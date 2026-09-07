import React, { useState, useEffect } from 'react';
import {
  Shield, UserCheck, LogOut, Server,
  Play, Users, ExternalLink, Home, BookOpen, Info, Mail
} from 'lucide-react';
import { api } from '../api';
import BrandLogo from './BrandLogo';

const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export default function Navbar({
  user,
  currentPage,
  onNavigate,
  onOpenAuth,
  onLogout,
  progressStats
}) {
  const [serverOnline, setServerOnline] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then(res => { if (mounted) setServerOnline(res.status === 'ok' || res.status === 'online'); })
      .catch(() => { if (mounted) setServerOnline(false); });
    return () => { mounted = false; };
  }, []);

  const total = progressStats?.total || 0;
  const completed = progressStats?.completed || 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const navLinks = [
    { key: 'home', label: 'Home', icon: <Home size={13} /> },
    { key: 'courses', label: 'Curriculum', icon: <BookOpen size={13} />, matchPages: ['courses', 'course-detail'] },
    { key: 'about', label: 'About', icon: <Info size={13} /> },
    { key: 'contact', label: 'Admissions', icon: <Mail size={13} /> },
  ];

  return (
    <nav className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0, 102, 255, 0.12)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'nowrap',
      whiteSpace: 'nowrap',
      gap: '16px',
      boxShadow: '0 4px 20px rgba(10, 25, 47, 0.04)',
      overflowX: 'auto',
      scrollbarWidth: 'none'
    }}>
      {/* Brand Logo Lockup (Strictly inline, single row) */}
      <div
        onClick={() => onNavigate('home')}
        style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}
      >
        <BrandLogo size={32} showText={true} />
      </div>

      {/* Nav Links - Single row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0,
        whiteSpace: 'nowrap'
      }}>
        {navLinks.map(link => {
          const isActive = link.matchPages
            ? link.matchPages.includes(currentPage)
            : currentPage === link.key;
          return (
            <button
              key={link.key}
              className={`nav-link-btn ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(link.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 600,
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                background: isActive ? 'linear-gradient(135deg, #0066FF 0%, #0284C7 100%)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: isActive ? '0 2px 10px rgba(0, 102, 255, 0.3)' : 'none'
              }}
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          );
        })}
      </div>

      {/* Actions - Single row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexShrink: 0,
        whiteSpace: 'nowrap'
      }}>
        {/* Production Cluster Status */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 10px',
          fontSize: '11px',
          fontWeight: 700,
          borderRadius: 'var(--radius-full)',
          background: 'rgba(0, 102, 255, 0.05)',
          border: '1px solid rgba(0, 102, 255, 0.15)',
          color: serverOnline ? '#0066FF' : serverOnline === false ? '#DC2626' : '#94A3B8',
          flexShrink: 0
        }} title="Production Cluster Status">
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: serverOnline ? '#10B981' : serverOnline === false ? '#DC2626' : '#94A3B8',
            boxShadow: serverOnline ? '0 0 8px #10B981' : 'none'
          }} />
          <span>{serverOnline ? 'Cluster Live' : serverOnline === false ? 'Offline' : 'Connecting...'}</span>
        </div>

        {/* Guest Controls */}
        {!user ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              className="btn-secondary"
              onClick={() => onOpenAuth('student', true)}
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                borderColor: 'rgba(0, 102, 255, 0.25)',
                color: '#0066FF',
                background: 'rgba(0, 102, 255, 0.05)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Users size={13} /> Enroll
            </button>

            <button
              className="btn-secondary"
              onClick={() => onOpenAuth('student', false)}
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Sign In
            </button>

            {/* Faculty Console external link */}
            <a
              href={ADMIN_PANEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#FFFFFF',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.2)',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Shield size={12} /> Console <ExternalLink size={10} />
            </a>
          </div>
        ) : (
          /* Logged in as Student */
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {total > 0 && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                fontSize: '11px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(0, 102, 255, 0.05)',
                border: '1px solid rgba(0, 102, 255, 0.15)',
                flexShrink: 0
              }}>
                <div style={{ width: '36px', height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #0066FF, #00D2FF)', borderRadius: '3px' }} />
                </div>
                <span style={{ color: '#0066FF', fontWeight: 800 }}>{pct}%</span>
              </div>
            )}

            <button
              className="btn-primary"
              onClick={() => onNavigate('learning')}
              style={{
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #0066FF 0%, #0284C7 100%)',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              <Play size={13} /> Workbench
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-full)',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              flexShrink: 0
            }}>
              <UserCheck size={13} color="#0066FF" />
              <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px' }}>
                {user.first_name || user.display_name || user.username}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '3px',
                background: 'rgba(0, 102, 255, 0.1)',
                color: '#0066FF'
              }}>
                Fellow
              </span>
            </div>

            <button
              className="btn-secondary"
              style={{ padding: '6px 10px', borderRadius: 'var(--radius-full)', flexShrink: 0 }}
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={13} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
