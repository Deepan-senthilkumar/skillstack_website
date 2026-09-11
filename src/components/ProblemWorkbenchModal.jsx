import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, CheckCircle2, Award, MessageSquare, AlertCircle,
  FileCode, Check, Terminal, Sparkles, HelpCircle, CheckSquare, XCircle, Clock, Zap,
  Shield, ShieldAlert, AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CountdownTimer from './CountdownTimer';
import RichContentRenderer from './RichContentRenderer';
import { api } from '../api';

export default function ProblemWorkbenchModal({ problem, onClose, onSubmitted }) {
  const existingSubmission = problem.my_submission;
  const access = problem.access_control || {};
  const isExpired = access.is_expired;
  const isUnlocked = access.is_unlocked !== false;

  const [language, setLanguage] = useState(problem.language || 'python');
  const [code, setCode] = useState(
    existingSubmission?.submitted_code ||
    problem.starter_code ||
    (problem.language === 'c' ? '#include <stdio.h>\n\nint main() {\n    // Write your code here\n    \n    return 0;\n}' :
     problem.language === 'javascript' ? '// Write your solution here\nconsole.log("Output");\n' :
     '# Write your solution here\n')
  );
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Security test mode state
  const [securityViolations, setSecurityViolations] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pasteWarning, setPasteWarning] = useState(false);
  const [terminatedBySecurity, setTerminatedBySecurity] = useState(false);
  const violationLogsRef = useRef([]);

  const canSubmit = isUnlocked && (!isExpired || access.allow_late_submission) && !terminatedBySecurity;

  // Mobile Screen WakeLock
  useEffect(() => {
    let wakeLock = null;
    const acquireWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (e) {
        console.warn('WakeLock not active:', e);
      }
    };
    acquireWakeLock();
    return () => {
      if (wakeLock && wakeLock.release) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  // Security event listeners for practical test mode (Mobile & Desktop)
  useEffect(() => {
    if (terminatedBySecurity) return;

    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState !== 'visible') {
        handleSecurityInfraction('Switched browser tab, minimized window, or pulled down notification shade/overlay');
      }
    };

    const handleWindowBlur = () => {
      handleSecurityInfraction('Window lost focus / floating app or background overlay opened');
    };

    const handlePageHide = () => {
      handleSecurityInfraction('Page hidden / switched to another application');
    };

    // Split-screen / floating multi-window / window resizing detection
    const handleWindowResize = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia('(pointer: coarse)').matches;
      const screenW = window.screen.availWidth || window.screen.width;
      const screenH = window.screen.availHeight || window.screen.height;

      if (isMobile) {
        // Mobile split-screen (top/bottom or side-by-side) or floating pop-up view
        const activeEl = document.activeElement;
        const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

        const isMobileSplit =
          window.innerWidth < screenW * 0.78 ||
          (!isInputFocused && window.innerHeight < screenH * 0.60);

        if (isMobileSplit) {
          handleSecurityInfraction('Mobile Split-Screen / Floating Pop-up Window detected');
        }
      } else {
        // Desktop split-screen
        const isSplitScreen =
          window.innerWidth < (screenW * 0.72) ||
          window.innerHeight < (screenH * 0.65);

        if (isSplitScreen) {
          handleSecurityInfraction('Split-screen / Dual window or window resize detected');
        }
      }
    };

    const handleKeyDownGlobal = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        handleSecurityInfraction('Attempted to inspect element');
      }

      // Restrict copy / paste shortcuts
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V' || e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setPasteWarning(true);
        setTimeout(() => setPasteWarning(false), 3500);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    const handleCopyPasteEvent = (e) => {
      e.preventDefault();
      setPasteWarning(true);
      setTimeout(() => setPasteWarning(false), 3500);
      return false;
    };

    const handleSelectStart = (e) => {
      // Allow selection inside textarea, prevent on problem text
      if (e.target && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('resize', handleWindowResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleWindowResize);
    }
    window.addEventListener('keydown', handleKeyDownGlobal);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPasteEvent);
    document.addEventListener('paste', handleCopyPasteEvent);
    document.addEventListener('cut', handleCopyPasteEvent);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('resize', handleWindowResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleWindowResize);
      }
      window.removeEventListener('keydown', handleKeyDownGlobal);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPasteEvent);
      document.removeEventListener('paste', handleCopyPasteEvent);
      document.removeEventListener('cut', handleCopyPasteEvent);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [securityViolations, terminatedBySecurity]);

  const handleSecurityInfraction = (reason) => {
    const newCount = securityViolations + 1;
    setSecurityViolations(newCount);
    const log = `Infraction #${newCount}: ${reason} at ${new Date().toLocaleTimeString()}`;
    violationLogsRef.current.push(log);

    if (newCount === 1) {
      setShowWarningModal(true);
    } else if (newCount >= 2) {
      setShowWarningModal(false);
      setTerminatedBySecurity(true);
      handleTerminatePracticalForSecurity(log);
    }
  };

  const handleTerminatePracticalForSecurity = async (reason) => {
    setSubmitting(true);
    try {
      const result = await api.submitSolution(problem.id, code, language, null, notes);
      setErrorMsg('❌ Test Terminated: Security Protocol Violation (2 infractions/split-screen/app switches detected).');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRunTest = async () => {
    if (!code.trim()) {
      setErrorMsg('Please write your code before running test.');
      return;
    }
    setTesting(true);
    setErrorMsg('');
    try {
      const res = await api.testRunCode(problem.id, code, language, problem.expected_output);
      setTestResult(res);
      if (res.is_passed) {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Automated execution failed.');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setErrorMsg('Please write your code before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await api.submitSolution(problem.id, code, language, null, notes);
      setSuccessMsg(
        result.is_passed
          ? `🎉 Perfect Solution! Auto-Validated Correct (${result.execution_time_ms} ms)`
          : `Submitted (Attempt #${result.attempt_number || 1}) - Status: ${result.status}`
      );
      if (result.is_passed) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.7 }
        });
      }
      if (onSubmitted) {
        onSubmitted(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Please check connection or permissions.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="modal-overlay secure-exam-locked" onClick={onClose} style={{ userSelect: 'none' }}>
      <div className="modal-content secure-code-editor" style={{ maxWidth: '900px', width: '94%' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', padding: '16px 20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="lab-number" style={{ textTransform: 'uppercase', backgroundColor: '#1E293B', color: '#38BDF8' }}>
                {language}
              </span>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                {problem.topic_title}
              </span>
              <span className="security-active-pill pulse-warning">
                <Shield size={11} /> Mobile &amp; Desktop Shield Active
              </span>
            </div>
            <h2 style={{ fontSize: '18px', color: '#FFFFFF', margin: 0 }}>{problem.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px 8px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFFFFF', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ maxHeight: '78vh', overflowY: 'auto' }}>
          {/* Timeline & Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-elevated)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={17} color="var(--blue-vibrant)" />
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--blue-primary)' }}>
                {problem.points || 10} Points &bull; Live Compiler &amp; 70%+ Output Match Rule
              </span>
            </div>

            <CountdownTimer deadline={access.deadline} />
          </div>

          {/* Paste Warning Banner */}
          {pasteWarning && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1.5px solid #EF4444',
              color: '#991B1B',
              fontSize: '12.5px',
              fontWeight: 700,
              marginBottom: '14px',
              animation: 'fadeIn 0.2s ease'
            }}>
              <AlertTriangle size={16} color="#DC2626" />
              <span>⚠️ Copy &amp; Paste is strictly disabled in the Secured Exam Sandbox (Mobile clipboard &amp; long-press menus are blocked). Please type directly.</span>
            </div>
          )}

          {/* Problem Statement Card */}
          <div style={{
            background: '#FFFFFF',
            padding: '18px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--blue-vibrant)',
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)' }}>Problem Statement &amp; Requirements:</h4>
            <RichContentRenderer content={problem.description} />

            {problem.expected_output && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--blue-primary)', background: 'var(--blue-soft)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--blue-border)' }}>
                <span style={{ fontWeight: 800, display: 'block', marginBottom: '4px' }}>🎯 Target Expected Output:</span>
                <pre style={{ margin: 0, fontFamily: 'IBM Plex Mono', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                  {problem.expected_output}
                </pre>
              </div>
            )}
          </div>

          {/* Code Solution Editor with Language Selector */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode size={15} color="var(--blue-vibrant)" /> In-Browser Code Compiler
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--gray-50)'
                  }}
                >
                  <option value="python">Python 3</option>
                  <option value="c">C Programming</option>
                  <option value="javascript">JavaScript (Node)</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={testing || !canSubmit}
                  className="btn-secondary"
                  style={{
                    padding: '6px 14px',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    borderColor: 'var(--blue-border)',
                    color: '#1E40AF',
                    background: '#EFF6FF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Play size={13} fill="currentColor" /> {testing ? 'Compiling & Running…' : 'Compile & Run Code'}
                </button>
              </div>
            </div>

            <textarea
              className="code-editor-area secure-code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              onBeforeInput={(e) => {
                if (
                  e.inputType === 'insertFromPaste' ||
                  e.inputType === 'insertFromPasteAsQuotation' ||
                  e.inputType === 'insertFromDrop' ||
                  e.inputType === 'insertReplacementText'
                ) {
                  e.preventDefault();
                  setPasteWarning(true);
                  setTimeout(() => setPasteWarning(false), 3500);
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                setPasteWarning(true);
                setTimeout(() => setPasteWarning(false), 3500);
              }}
              onCopy={(e) => e.preventDefault()}
              onCut={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onContextMenu={(e) => e.preventDefault()}
              placeholder="Type your program code here (Copy/Paste disabled across Mobile & Desktop)..."
              disabled={!canSubmit}
              rows={12}
              style={{
                width: '100%',
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13.5px',
                lineHeight: 1.5,
                background: '#0F172A',
                color: '#F8FAFC',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #1E293B',
                outline: 'none',
                resize: 'vertical',
                WebkitTouchCallout: 'none',
              }}
            />
          </div>

          {/* Test Runner Results Panel with 70%+ Threshold Visualizer */}
          {testResult && (
            <div style={{
              background: testResult.is_passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${testResult.is_passed ? '#10B981' : '#EF4444'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {testResult.is_passed ? (
                    <CheckCircle2 size={20} color="#10B981" />
                  ) : (
                    <XCircle size={20} color="#EF4444" />
                  )}
                  <div>
                    <strong style={{ fontSize: '14.5px', color: testResult.is_passed ? '#047857' : '#B91C1C', display: 'block' }}>
                      {testResult.is_passed
                        ? `✅ PASSED: ${testResult.match_percentage || 100}% Output Match (≥70% Required)`
                        : `❌ FAILED: ${testResult.match_percentage || 0}% Output Match (Needs ≥70% to Pass)`}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Status: {testResult.status}
                    </span>
                  </div>
                </div>

                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: testResult.is_passed ? '#DCFCE7' : '#FEE2E2',
                  color: testResult.is_passed ? '#166534' : '#991B1B',
                  fontWeight: 800,
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}>
                  Match: {testResult.match_percentage || 0}% / 70% min
                </div>
              </div>

              {/* Actual Console Output */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', display: 'block', marginBottom: '4px' }}>
                  Captured Actual Console Output (stdout):
                </span>
                <pre style={{
                  background: '#0F172A',
                  color: '#F8FAFC',
                  fontFamily: 'IBM Plex Mono',
                  fontSize: '12px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  margin: 0,
                  whiteSpace: 'pre-wrap'
                }}>
                  {testResult.actual_output || '(No console output produced)'}
                </pre>
              </div>

              {testResult.error_detail && (
                <div style={{ marginTop: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#DC2626', display: 'block', marginBottom: '4px' }}>
                    Error Output (stderr / compilation):
                  </span>
                  <pre style={{
                    background: '#450A0A',
                    color: '#FECACA',
                    fontFamily: 'IBM Plex Mono',
                    fontSize: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    margin: 0,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {testResult.error_detail}
                  </pre>
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div style={{ color: '#DC2626', background: '#FEE2E2', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{ color: '#047857', background: '#E6F8F0', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', padding: '14px 20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={15} /> {submitting ? 'Auto-Grading…' : 'Submit for Auto-Validation'}
          </button>
        </div>
      </div>

      {/* Security Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(220, 38, 38, 0.3)',
            border: '2px solid #EF4444'
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#991B1B', marginBottom: '8px' }}>
              ⚠️ SECURITY WARNING (1/1)
            </h3>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
              Tab switch or window blur detected during lab solve.
              <strong> If you switch tabs or leave this window again, your test will be marked as FAILED automatically!</strong>
            </p>

            <button
              onClick={() => setShowWarningModal(false)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              I Understand — Return to Lab
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
