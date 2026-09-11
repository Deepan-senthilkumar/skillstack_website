import React, { useState, useEffect, useRef } from 'react';
import {
  Shield, ShieldAlert, AlertTriangle, CheckCircle2, XCircle,
  Clock, ArrowRight, ArrowLeft, RefreshCw, X, Award, Check,
  Sparkles, HelpCircle, Lock, BookOpen, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function SecureQuizModal({ topic, onClose, onPassed }) {
  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [cooldownState, setCooldownState] = useState(null);

  // Active quiz state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { [question_id]: "A" | "B" | "C" | "D" }
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Security enforcement state
  const [securityViolations, setSecurityViolations] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer state (5 minutes = 300 seconds)
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timeTaken, setTimeTaken] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const violationLogsRef = useRef([]);

  // Load quiz on open
  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topic?.topic_id, topic?.id]);

  const loadQuiz = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const topicId = topic.topic_id || topic.id;
      const data = await api.startTopicQuiz(topicId);
      setQuizData(data);

      // Start test timer
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAutoSubmitOnTimeout();
            return 0;
          }
          return prev - 1;
        });
        setTimeTaken(prev => prev + 1);
      }, 1000);

      // Request fullscreen (Desktop & Mobile Chrome/Safari)
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        }
      } catch (e) {
        console.warn('Fullscreen request bypassed', e);
      }
    } catch (err) {
      if (err.data && err.data.in_cooldown) {
        setCooldownState({
          remaining: err.data.cooldown_seconds_remaining,
          message: err.data.error,
        });
      } else {
        setErrorMsg(err.message || 'Failed to initialize secure topic assessment.');
      }
    } finally {
      setLoading(false);
    }
  };

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

  // Security infraction trigger
  const handleSecurityInfraction = (reason) => {
    if (result) return; // test already concluded

    const newViolationCount = securityViolations + 1;
    setSecurityViolations(newViolationCount);
    const logEntry = `Infraction #${newViolationCount}: ${reason} at ${new Date().toLocaleTimeString()}`;
    violationLogsRef.current.push(logEntry);

    if (newViolationCount === 1) {
      // 1st warning
      setWarningMessage(
        '⚠️ SECURITY VIOLATION DETECTED (Warning 1/1):\n' +
        `${reason}.\n` +
        'Leaving the test window, opening split-screen, or using floating apps/overlays again will automatically TERMINATE your exam with a FAIL and a 10-minute lock!'
      );
      setShowWarningModal(true);
    } else if (newViolationCount >= 2) {
      // 2nd warning -> Instant fail
      setShowWarningModal(false);
      handleTerminateExamForSecurity(logEntry);
    }
  };

  // Anti-cheating event listeners (Mobile & Desktop)
  useEffect(() => {
    if (!quizData || result) return;

    // 1. Tab switch / window minimize / floating overlay / notification shade detection
    const handleVisibilityChange = () => {
      if (document.hidden || document.visibilityState !== 'visible') {
        handleSecurityInfraction('Switched browser tab, minimized window, or pulled down notification shade/overlay');
      }
    };

    // 2. Window blur (clicking outside the exam, opening floating app or chat bubble)
    const handleWindowBlur = () => {
      handleSecurityInfraction('Window focus lost / floating app or background overlay opened');
    };

    const handlePageHide = () => {
      handleSecurityInfraction('Page hidden / switched to another application');
    };

    // 3. Mobile & Desktop Split-screen and window resize detection
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
          handleSecurityInfraction('Split-screen / Multi-window or window resize detected');
        }
      }
    };

    // 4. Prevent devtools and prohibited key combinations
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        handleSecurityInfraction('Attempted to inspect element / open developer tools');
      }

      // Restrict copy/paste keys
      if ((e.ctrlKey || e.metaKey) && (e.key === 'v' || e.key === 'V' || e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
      }
    };

    // 5. Disable right-click context menu and long-press callouts
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // 6. Disable copy/paste/cut/select
    const handleCopyPaste = (e) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('resize', handleWindowResize);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleWindowResize);
    }
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('resize', handleWindowResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleWindowResize);
      }
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [quizData, result, securityViolations]);

  const handleSelectOption = (questionId, optionLetter) => {
    setAnswers(prev => ({
      ...prev,
      [String(questionId)]: optionLetter,
    }));
  };

  const handleAutoSubmitOnTimeout = () => {
    handleSubmit(true);
  };

  const handleTerminateExamForSecurity = async (reason) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    try {
      const topicId = topic.topic_id || topic.id;
      const payload = {
        answers,
        question_ids: (quizData?.questions || []).map(q => q.id),
        time_taken_seconds: timeTaken,
        security_violations: 2,
        violation_details: violationLogsRef.current.join('; '),
        is_terminated_by_security: true,
      };

      const res = await api.submitTopicQuiz(topicId, payload);
      setResult(res);
    } catch (err) {
      console.error('Failed to submit security termination', err);
      setResult({
        is_passed: false,
        status: 'FAILED_SECURITY',
        score: 0,
        total_questions: 5,
        percentage: 0.0,
        cooldown_seconds_remaining: 600,
        message: '❌ Test Terminated: Security Protocol Violation (2 infractions recorded).'
      });
    } finally {
      setSubmitting(false);
      // Exit fullscreen if possible
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSubmit = async (isTimeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);

    try {
      const topicId = topic.topic_id || topic.id;
      const payload = {
        answers,
        question_ids: (quizData?.questions || []).map(q => q.id),
        time_taken_seconds: timeTaken,
        security_violations: securityViolations,
        violation_details: violationLogsRef.current.join('; '),
        is_terminated_by_security: false,
      };

      const res = await api.submitTopicQuiz(topicId, payload);
      setResult(res);

      if (res.is_passed) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (onPassed) {
          onPassed(res);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit assessment answers.');
    } finally {
      setSubmitting(false);
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const questions = quizData?.questions || [];
  const currentQ = questions[currentQuestionIdx];
  const answeredCount = Object.keys(answers).length;

  return (
    <div
      className="modal-overlay secure-exam-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
    >
      <div
        className="secure-exam-window"
        style={{
          width: '95%',
          maxWidth: '860px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1.5px solid #E2E8F0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Security Top Bar */}
        <div style={{
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: '#1E293B',
              color: '#38BDF8'
            }}>
              <Shield size={16} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.5px' }}>
                  SECURED TEST ENVIRONMENT
                </span>
                <span style={{
                  fontSize: '10px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ADE80',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 700
                }}>
                  LOCKDOWN ACTIVE
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                {topic?.title} &bull; 5 Random Questions &bull; Pass Gate: 50%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Countdown timer */}
            {!result && !loading && !cooldownState && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: timeRemaining < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: timeRemaining < 60 ? '#F87171' : '#F8FAFC',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 800,
                fontFamily: 'monospace'
              }}>
                <Clock size={14} />
                <span>{formatTimer(timeRemaining)}</span>
              </div>
            )}

            {/* Warning Infraction Badge */}
            {securityViolations > 0 && !result && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                color: '#F87171',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800
              }}>
                <AlertTriangle size={12} />
                <span>Warning 1/1</span>
              </div>
            )}

            {result && (
              <button
                onClick={onClose}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: '#FAFAFA' }}>
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
              <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 12px', color: '#7B1C6E' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                Securing Examination Sandbox...
              </div>
              <div style={{ fontSize: '12.5px', marginTop: '4px' }}>
                Randomly selecting 5 questions from topic question pool.
              </div>
            </div>
          )}

          {/* Cooldown Blocked State */}
          {cooldownState && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(217, 119, 6, 0.1)',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <Clock size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                10-Minute Study Cooldown Active
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                You must review the study notes thoroughly before retaking the test.
                Assessment access will unlock automatically when the cooldown finishes.
              </p>
              <div style={{
                display: 'inline-block',
                padding: '12px 24px',
                borderRadius: '16px',
                backgroundColor: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                fontSize: '18px',
                fontWeight: 800,
                color: '#92400E',
                fontFamily: 'monospace',
                marginBottom: '24px'
              }}>
                ⏳ {Math.floor(cooldownState.remaining / 60)}m {cooldownState.remaining % 60}s Remaining
              </div>
              <div>
                <button
                  onClick={onClose}
                  className="btn-primary"
                  style={{ padding: '10px 24px', borderRadius: '12px', fontSize: '13px' }}
                >
                  Return to Study Notes
                </button>
              </div>
            </div>
          )}

          {/* Error State */}
          {errorMsg && !loading && !cooldownState && !result && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <AlertCircle size={40} color="#EF4444" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                Unable to Start Test
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', margin: '0 auto 20px' }}>
                {errorMsg}
              </p>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ padding: '8px 20px', borderRadius: '12px' }}
              >
                Close
              </button>
            </div>
          )}

          {/* Active Quiz Test Questions */}
          {!loading && !errorMsg && !cooldownState && !result && currentQ && (
            <div>
              {/* Question Navigation Tracker */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {questions.map((q, idx) => {
                    const isAnswered = Boolean(answers[String(q.id)]);
                    const isCurrent = idx === currentQuestionIdx;
                    return (
                      <button
                        key={q.id || idx}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          border: isCurrent ? '2px solid #7B1C6E' : '1px solid #CBD5E1',
                          backgroundColor: isCurrent ? '#7B1C6E' : isAnswered ? '#DCFCE7' : '#FFFFFF',
                          color: isCurrent ? '#FFFFFF' : isAnswered ? '#166534' : '#64748B',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                  Answered: <strong style={{ color: '#0F172A' }}>{answeredCount} / {questions.length}</strong>
                </div>
              </div>

              {/* Question Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid #E2E8F0',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#7B1C6E',
                    backgroundColor: 'rgba(123, 28, 110, 0.08)',
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}>
                    Question {currentQuestionIdx + 1} of {questions.length}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>&bull;</span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>1 Mark</span>
                </div>

                <h2 style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1.5,
                  marginBottom: '20px'
                }}>
                  {currentQ.question_text}
                </h2>

                {/* 4 Choices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { key: 'A', text: currentQ.option_a },
                    { key: 'B', text: currentQ.option_b },
                    { key: 'C', text: currentQ.option_c },
                    { key: 'D', text: currentQ.option_d },
                  ].map(({ key, text }) => {
                    const isSelected = answers[String(currentQ.id)] === key;
                    return (
                      <div
                        key={key}
                        onClick={() => handleSelectOption(currentQ.id, key)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          padding: '14px 18px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid #7B1C6E' : '1.5px solid #E2E8F0',
                          backgroundColor: isSelected ? 'rgba(123, 28, 110, 0.05)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          border: isSelected ? '2px solid #7B1C6E' : '1.5px solid #CBD5E1',
                          backgroundColor: isSelected ? '#7B1C6E' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#64748B',
                          fontWeight: 800,
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          {key}
                        </div>
                        <span style={{
                          fontSize: '13.5px',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#7B1C6E' : '#1E293B',
                          flex: 1
                        }}>
                          {text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIdx === 0}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 18px',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                    opacity: currentQuestionIdx === 0 ? 0.4 : 1
                  }}
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {currentQuestionIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIdx(prev => Math.min(questions.length - 1, prev + 1))}
                      className="btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '9px 18px',
                        borderRadius: '12px',
                        fontSize: '12.5px'
                      }}
                    >
                      Next <ArrowRight size={14} />
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                    className="btn-primary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 24px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: 800,
                      backgroundColor: '#16A34A',
                      borderColor: '#16A34A'
                    }}
                  >
                    {submitting ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                    <span>Submit Exam</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Screen */}
          {result && (
            <div style={{ padding: '10px' }}>
              {/* Score Header */}
              <div style={{
                textAlign: 'center',
                padding: '28px',
                borderRadius: '20px',
                backgroundColor: result.is_passed ? '#F0FDF4' : '#FEF2F2',
                border: `1.5px solid ${result.is_passed ? '#BBF7D0' : '#FECACA'}`,
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: result.is_passed ? '#DCFCE7' : '#FEE2E2',
                  color: result.is_passed ? '#16A34A' : '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px'
                }}>
                  {result.is_passed ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                </div>

                <h2 style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: result.is_passed ? '#14532D' : '#7F1D1D',
                  marginBottom: '6px'
                }}>
                  {result.is_passed ? '🎉 Topic Assessment Passed!' : result.status === 'FAILED_SECURITY' ? '❌ Exam Terminated for Security Violations' : '❌ Topic Assessment Failed'}
                </h2>

                <div style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: result.is_passed ? '#16A34A' : '#DC2626',
                  fontFamily: 'monospace',
                  margin: '8px 0'
                }}>
                  {result.score} / {result.total_questions} ({result.percentage}%)
                </div>

                <p style={{
                  fontSize: '13.5px',
                  color: result.is_passed ? '#166534' : '#991B1B',
                  maxWidth: '520px',
                  margin: '0 auto',
                  lineHeight: 1.5
                }}>
                  {result.is_passed
                    ? 'Congratulations! You met the 50% passing criteria. This topic is now verified and marked as complete!'
                    : `You needed at least 50% (3/5) to pass. A 10-minute study cooldown has been applied. Please re-read the study notes before re-attempting.`}
                </p>

                {!result.is_passed && result.cooldown_seconds_remaining > 0 && (
                  <div style={{
                    marginTop: '14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800,
                    fontFamily: 'monospace'
                  }}>
                    <Clock size={13} />
                    <span>Re-attempt available in ~10 minutes</span>
                  </div>
                )}
              </div>

              {/* Answers & Explanations Review List */}
              {result.review && result.review.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                    📝 Question &amp; Solution Review
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {result.review.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '16px',
                          border: `1.5px solid ${item.is_correct ? '#BBF7D0' : '#FECACA'}`,
                          padding: '18px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>
                            <span style={{ color: '#64748B', marginRight: '6px' }}>Q{idx + 1}.</span>
                            {item.question_text}
                          </div>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '12px',
                            backgroundColor: item.is_correct ? '#DCFCE7' : '#FEE2E2',
                            color: item.is_correct ? '#166534' : '#991B1B',
                            flexShrink: 0
                          }}>
                            {item.is_correct ? 'Correct (+1)' : 'Incorrect (0)'}
                          </span>
                        </div>

                        <div style={{
                          fontSize: '12.5px',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          marginBottom: '8px'
                        }}>
                          <div>Your Choice: <strong style={{ color: item.is_correct ? '#16A34A' : '#DC2626' }}>Option {item.user_choice || 'None'}</strong></div>
                          <div>Correct Answer: <strong style={{ color: '#16A34A' }}>Option {item.correct_option}</strong></div>
                        </div>

                        {item.explanation && (
                          <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', paddingLeft: '4px' }}>
                            💡 <strong>Explanation:</strong> {item.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Done button */}
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <button
                  onClick={onClose}
                  className="btn-primary"
                  style={{ padding: '10px 32px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 800 }}
                >
                  Return to Learning Portal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Modal (1st Infraction) */}
      {showWarningModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
              Tab switch, window minimize, or loss of window focus was detected.
              <strong> If you leave or switch tabs once more, the exam will be automatically TERMINATED with a FAIL status and a 10-minute lock!</strong>
            </p>

            <button
              onClick={() => {
                setShowWarningModal(false);
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().catch(() => {});
                }
              }}
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
              I Understand — Return to Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
