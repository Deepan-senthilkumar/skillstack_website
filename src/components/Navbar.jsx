import React, { useState, useEffect } from 'react';
import {
  Shield, UserCheck, LogOut, Server,
  Play, Users, ExternalLink, Home, BookOpen, Info, Mail,
  Menu, X, Sparkles, ChevronRight
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.checkHealth()
      .then(res => { if (mounted) setServerOnline(res.status === 'ok' || res.status === 'online'); })
      .catch(() => { if (mounted) setServerOnline(false); });
    return () => { mounted = false; };
  }, []);

  // Close mobile drawer on route change or ESC
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const total = progressStats?.total || 0;
  const completed = progressStats?.completed || 0;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const navLinks = [
    { key: 'home', label: 'Home', icon: <Home size={15} /> },
    { key: 'courses', label: 'Curriculum', icon: <BookOpen size={15} />, matchPages: ['courses', 'course-detail'] },
    { key: 'about', label: 'About', icon: <Info size={15} /> },
    { key: 'contact', label: 'Admissions', icon: <Mail size={15} /> },
  ];

  const handleNavClick = (key) => {
    onNavigate(key);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar" style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(123, 28, 110, 0.12)',
        padding: '0 20px',
        height: '64px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 20px rgba(31, 8, 28, 0.04)',
      }}>
        {/* Brand Logo Lockup */}
        <div
          onClick={() => handleNavClick('home')}
          style={{ cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          <BrandLogo size={32} showText={true} />
        </div>

        {/* Desktop Nav Links (Hidden on mobile) */}
        <div className="desktop-only-flex" style={{
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
                onClick={() => handleNavClick(link.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  boxShadow: isActive ? '0 2px 10px rgba(123, 28, 110, 0.3)' : 'none'
                }}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Actions Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}>
          {/* Production Cluster Status (Desktop only) */}
          <div className="desktop-only-flex" style={{
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(123, 28, 110, 0.05)',
            border: '1px solid rgba(123, 28, 110, 0.15)',
            color: serverOnline ? '#7B1C6E' : serverOnline === false ? '#DC2626' : '#94A3B8',
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

          {/* Desktop Auth Controls */}
          {!user ? (
            <div className="desktop-only-flex" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <button
                className="btn-secondary"
                onClick={() => onOpenAuth('student', true)}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  borderColor: 'rgba(123, 28, 110, 0.25)',
                  color: '#7B1C6E',
                  background: 'rgba(123, 28, 110, 0.05)',
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
            </div>
          ) : (
            /* Logged in as Student */
            <div className="desktop-only-flex" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {total > 0 && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(123, 28, 110, 0.05)',
                  border: '1px solid rgba(123, 28, 110, 0.15)',
                  flexShrink: 0
                }}>
                  <div style={{ width: '36px', height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7B1C6E, #FDC029)', borderRadius: '3px' }} />
                  </div>
                  <span style={{ color: '#7B1C6E', fontWeight: 800 }}>{pct}%</span>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => handleNavClick('learning')}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
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
                <UserCheck size={13} color="#7B1C6E" />
                <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '12px' }}>
                  {user.first_name || user.display_name || user.username}
                </span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(123, 28, 110, 0.1)',
                  color: '#7B1C6E'
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

          {/* Quick Mobile Action (Workbench if logged in, Sign In if guest) */}
          <div className="mobile-only-flex" style={{ alignItems: 'center', gap: '6px' }}>
            {user ? (
              <button
                onClick={() => handleNavClick('learning')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Play size={12} /> Workbench
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('student', false)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: 700,
                  background: 'rgba(123, 28, 110, 0.08)',
                  color: '#7B1C6E',
                  border: '1px solid rgba(123, 28, 110, 0.2)'
                }}
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: mobileMenuOpen ? '#7B1C6E' : '#F8FAFC',
                color: mobileMenuOpen ? '#FFFFFF' : '#1E293B',
                border: '1px solid #E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          MOBILE SLIDE-OVER SHEET DRAWER
          ========================================================================= */}
      {mobileMenuOpen && (
        <div
          className="mobile-sheet-overlay"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 1100,
            animation: 'fadeIn 0.2s ease forwards'
          }}
        >
          <div
            className="mobile-sheet-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '85%',
              maxWidth: '360px',
              background: '#FFFFFF',
              zIndex: 1101,
              boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              overflowY: 'auto'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #F1F5F9',
              background: '#FAFAFA'
            }}>
              <BrandLogo size={28} showText={true} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* User Profile / Guest Card in Drawer */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
              {user ? (
                <div style={{
                  background: 'linear-gradient(135deg, #FDF4FF 0%, #F5F3FF 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1.5px solid #F0ABFC'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7B1C6E, #FDC029)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '15px'
                    }}>
                      {(user.first_name || user.username || 'F')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '14px' }}>
                        {user.first_name || user.display_name || user.username}
                      </div>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        color: '#701A75',
                        background: '#FDF4FF',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        SkillStack Fellow
                      </span>
                    </div>
                  </div>

                  {total > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                        <span>Curriculum Progress</span>
                        <span style={{ color: '#7B1C6E' }}>{completed}/{total} ({pct}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #7B1C6E, #FDC029)' }} />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleNavClick('learning')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7B1C6E 0%, #A21CAF 100%)',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(123, 28, 110, 0.25)'
                    }}
                  >
                    <Play size={14} /> Open Student Workbench
                  </button>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid #E2E8F0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Sparkles size={16} color="#7B1C6E" />
                    <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#0F172A' }}>
                      Learn Django in Tamil
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px', lineHeight: 1.5 }}>
                    Master full-stack web development with Tamil audio explanations & practice labs.
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('student', true); }}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Enroll Free
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); onOpenAuth('student', false); }}
                      style={{
                        flex: 1,
                        padding: '9px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        color: '#7B1C6E',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        border: '1.5px solid rgba(123, 28, 110, 0.2)',
                        cursor: 'pointer'
                      }}
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links in Drawer */}
            <div style={{ padding: '16px 20px', flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Main Navigation
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navLinks.map(link => {
                  const isActive = link.matchPages
                    ? link.matchPages.includes(currentPage)
                    : currentPage === link.key;
                  return (
                    <button
                      key={link.key}
                      onClick={() => handleNavClick(link.key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: isActive ? 700 : 600,
                        background: isActive ? 'rgba(123, 28, 110, 0.08)' : 'transparent',
                        color: isActive ? '#7B1C6E' : '#334155',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: isActive ? '#7B1C6E' : '#64748B' }}>
                          {link.icon}
                        </span>
                        <span>{link.label}</span>
                      </div>
                      <ChevronRight size={14} color={isActive ? '#7B1C6E' : '#CBD5E1'} />
                    </button>
                  );
                })}
              </div>

              {/* Status and Additional Links */}
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569'
                }}>
                  <span>Backend Status</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 700,
                    color: serverOnline ? '#16A34A' : '#DC2626'
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: serverOnline ? '#16A34A' : '#DC2626'
                    }} />
                    {serverOnline ? 'Connected' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer Footer (Logout / Admin link) */}
            <div style={{
              padding: '16px 20px',
              borderTop: '1px solid #F1F5F9',
              background: '#FAFAFA'
            }}>
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#FEE2E2',
                    color: '#DC2626',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={14} /> Sign Out of Fellow Account
                </button>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '11.5px', color: '#94A3B8' }}>
                  SkillStack Learning Platform © 2026
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
