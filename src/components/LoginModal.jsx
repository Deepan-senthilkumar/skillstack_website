import React, { useState } from 'react';
import {
  Shield, BookOpen, Lock, User, AlertCircle, ArrowRight,
  Phone, Mail, KeyRound, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { api } from '../api';
import BrandLogo from './BrandLogo';

export default function LoginModal({
  onLoginSuccess,
  onClose,
  initialTab = 'student',
  initialRegister = false
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'student' | 'staff'
  const [isStudentRegister, setIsStudentRegister] = useState(initialRegister);

  // Student Login state
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPin, setStudentPin] = useState('');

  // Student Register state
  const [studentFullName, setStudentFullName] = useState('');
  const [studentRegMobile, setStudentRegMobile] = useState('');
  const [studentRegEmail, setStudentRegEmail] = useState('');
  const [studentRegPin, setStudentRegPin] = useState('');

  // Staff Login state
  const [staffUsername, setStaffUsername] = useState('');
  const [staffPassword, setStaffPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Student PIN Login
  const handleStudentLogin = async (idVal, pinVal) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await api.studentLogin(idVal || studentIdentifier, pinVal || studentPin);
      onLoginSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message || 'PIN verification failed. Check your mobile number and 4-digit PIN.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Student Registration
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    if (studentRegPin.length !== 4 || isNaN(studentRegPin)) {
      setErrorMsg('Please enter exactly 4 numerical digits for your PIN.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      // Backend serializer expects: name, mobile_number, email, pin, batch_name
      await api.studentRegister({
        name: studentFullName,
        mobile_number: studentRegMobile,
        email: studentRegEmail,
        pin: studentRegPin,
        batch_name: '2026 Mastery Batch'
      });
      // Now auto-login using mobile + PIN since register returns {message, user} only
      setSuccessMsg('Account created! Logging you in...');
      const loggedInUser = await api.studentLogin(studentRegMobile, studentRegPin);
      setTimeout(() => {
        onLoginSuccess(loggedInUser);
        if (onClose) onClose();
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Mobile or email may already be in use.');
      setLoading(false);
    }
  };

  // Handle Staff Login
  const handleStaffLogin = async (uVal, pVal) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const user = await api.login(uVal || staffUsername, pVal || staffPassword);
      onLoginSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Staff authentication failed. Verify username and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(6px)', zIndex: 9999 }}>
      <div className="modal-content" style={{
        maxWidth: '460px',
        padding: '32px 28px',
        position: 'relative',
        background: '#FFFFFF',
        boxShadow: '0 20px 48px rgba(30, 58, 138, 0.16)'
      }}>
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'var(--bg-main)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
            title="Close"
          >
            <X size={18} />
          </button>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <BrandLogo size={36} showText={true} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            {activeTab === 'student'
              ? (isStudentRegister ? 'Fellow Enrollment & Security Passcode Setup' : 'Engineering Fellow Access via Mobile & Security PIN')
              : 'Senior Faculty Command Console'}
          </p>
        </div>

        {/* Login Mode Tabs — Student / Fellow */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: 'var(--bg-main)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setIsStudentRegister(false); setErrorMsg(''); }}
            style={{
              flex: 1, padding: '9px',
              borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: activeTab === 'student' && !isStudentRegister ? 'var(--blue-gradient)' : 'transparent',
              color: activeTab === 'student' && !isStudentRegister ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: activeTab === 'student' && !isStudentRegister ? '0 2px 8px var(--blue-glow)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={15} /> Fellow Login
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('student'); setIsStudentRegister(true); setErrorMsg(''); }}
            style={{
              flex: 1, padding: '9px',
              borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: isStudentRegister ? 'var(--blue-gradient)' : 'transparent',
              color: isStudentRegister ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: isStudentRegister ? '0 2px 8px var(--blue-glow)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={15} /> Enroll Fellow
          </button>
        </div>

        {/* Faculty Console redirect notice */}
        <div style={{
          background: 'var(--bg-main)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '10px 14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Shield size={14} color="var(--blue-primary)" />
            <span>Faculty or Domain Chair?</span>
          </div>
          <a
            href={import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px', fontWeight: 700, color: 'var(--blue-primary)',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px',
              padding: '5px 12px', borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--blue-border)',
              background: 'white', whiteSpace: 'nowrap'
            }}
          >
            Open Faculty Console →
          </a>
        </div>


        {/* ================= STUDENT TAB CONTENT ================= */}
        {activeTab === 'student' && (
          <div>
            {/* Student Sub-toggle: Sign In vs Register */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => { setIsStudentRegister(false); setErrorMsg(''); }}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isStudentRegister ? '1px solid var(--border-subtle)' : 'none',
                  background: isStudentRegister ? 'transparent' : 'var(--blue-soft)',
                  color: isStudentRegister ? 'var(--text-secondary)' : 'var(--blue-primary)',
                  cursor: 'pointer'
                }}
              >
                Sign In with PIN
              </button>
              <button
                type="button"
                onClick={() => { setIsStudentRegister(true); setErrorMsg(''); }}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: !isStudentRegister ? '1px solid var(--border-subtle)' : 'none',
                  background: !isStudentRegister ? 'transparent' : 'var(--blue-soft)',
                  color: !isStudentRegister ? 'var(--text-secondary)' : 'var(--blue-primary)',
                  cursor: 'pointer'
                }}
              >
                + Register as Student
              </button>
            </div>

            {isStudentRegister ? (
              /* STUDENT REGISTRATION FORM */
              <form onSubmit={handleStudentRegister}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. K. Karthik"
                        value={studentFullName}
                        onChange={(e) => setStudentFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Mobile Number * (Used for Sign In)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={studentRegMobile}
                        onChange={(e) => setStudentRegMobile(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="email"
                        required
                        placeholder="e.g. karthik@gmail.com"
                        value={studentRegEmail}
                        onChange={(e) => setStudentRegEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Set 4-Digit Login PIN * (e.g. 1234)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="4-digit PIN"
                        value={studentRegPin}
                        onChange={(e) => setStudentRegPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        style={{
                          width: '100%',
                          padding: '9px 12px 9px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '15px',
                          letterSpacing: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                  disabled={loading}
                >
                  {loading ? 'Creating Student Account...' : 'Complete Registration & Access Labs'}
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              /* STUDENT LOGIN WITH PIN FORM */
              <form onSubmit={(e) => { e.preventDefault(); handleStudentLogin(); }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Registered Mobile Number or Email
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. 9876543210 or student"
                        value={studentIdentifier}
                        onChange={(e) => setStudentIdentifier(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '13.5px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      4-Digit Secret PIN
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                      <input
                        type="password"
                        required
                        maxLength={4}
                        placeholder="••••"
                        value={studentPin}
                        onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          background: 'var(--bg-main)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '16px',
                          letterSpacing: '4px',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                  disabled={loading}
                >
                  {loading ? 'Verifying PIN...' : 'Sign In to Learning Lab'}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* ================= STAFF TAB CONTENT ================= */}
        {activeTab === 'staff' && (
          <div>
            <form onSubmit={(e) => { e.preventDefault(); handleStaffLogin(); }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Staff Username or Official Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. staff or instructor_vignesh"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Staff Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-tertiary)' }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={staffPassword}
                      onChange={(e) => setStaffPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '13.5px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                marginBottom: '16px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--blue-soft)',
                border: '1px solid var(--blue-border)',
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5
              }}>
                <Shield size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: 'var(--blue-primary)' }} />
                Staff accounts are provisioned exclusively by the Academy Admin. Faculty can view syllabus, manage deadlines, and observe student output marks.
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px' }}
                disabled={loading}
              >
                {loading ? 'Authenticating Staff...' : 'Sign In to Teaching Studio'}
                <ArrowRight size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Feedback alerts */}
        {errorMsg && (
          <div style={{
            marginTop: '14px',
            background: 'var(--coral-soft)',
            color: 'var(--coral)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            marginTop: '14px',
            background: 'var(--teal-soft)',
            color: 'var(--teal)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} /> {successMsg}
          </div>
        )}
      </div>
    </div>
  );
}
