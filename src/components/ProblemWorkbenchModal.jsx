import React, { useState } from 'react';
import {
  X, Play, CheckCircle2, Award, MessageSquare, AlertCircle,
  FileCode, Check, Terminal, Sparkles, HelpCircle, CheckSquare, XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CountdownTimer from './CountdownTimer';
import { api } from '../api';

export default function ProblemWorkbenchModal({ problem, onClose, onSubmitted }) {
  const existingSubmission = problem.my_submission;
  const access = problem.access_control || {};
  const isExpired = access.is_expired;
  const isUnlocked = access.is_unlocked;

  const [code, setCode] = useState(
    existingSubmission?.submitted_code ||
    problem.starter_code ||
    '# Write your Django solution or code snippet here\n\n'
  );
  const [notes, setNotes] = useState(existingSubmission?.notes || '');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const canSubmit = isUnlocked && (!isExpired || access.allow_late_submission);

  const handleRunTest = async () => {
    if (!code.trim()) {
      setErrorMsg('Please write your code or solution before running automated tests.');
      return;
    }
    setTesting(true);
    setErrorMsg('');
    try {
      const res = await api.testRunCode(problem.id, code, notes);
      setTestResult(res);
      if (res.status === 'PASSED') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Automated test execution failed.');
    } finally {
      setTesting(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setErrorMsg('Please write your code or solution before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const result = await api.submitSolution(problem.id, code, notes);
      setSuccessMsg(`Solution submitted and automatically graded! Score: ${result.score}/${result.max_points} (${result.status})`);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 }
      });
      if (onSubmitted) {
        onSubmitted(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit. Check deadline or access permissions.');
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '880px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="lab-number">{problem.module_level?.toUpperCase()}</span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {problem.module_name} &bull; {problem.topic_title}
              </span>
            </div>
            <h2 style={{ fontSize: '20px', color: 'var(--text-primary)' }}>{problem.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '6px 8px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Timeline & Status Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-elevated)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={17} color="var(--blue-vibrant)" />
              <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--blue-primary)' }}>
                {problem.points} Marks Possible &bull; Instant Automated Evaluation
              </span>
            </div>

            <CountdownTimer deadline={access.deadline} />
          </div>

          {/* Problem Statement Card */}
          <div style={{
            background: '#FFFFFF',
            padding: '18px 20px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            borderLeft: '4px solid var(--blue-vibrant)',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)' }}>Assignment Task:</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
              {problem.description}
            </p>

            {problem.test_criteria && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--blue-primary)', background: 'var(--blue-soft)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--blue-border)' }}>
                ⚡ <strong>Automated Test Criteria:</strong> {problem.test_criteria}
              </div>
            )}

            {problem.expected_keywords && (
              <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                🔑 <strong>Required Django Keywords:</strong> <code>{problem.expected_keywords}</code>
              </div>
            )}

            {problem.expected_output_hint && (
              <div style={{ marginTop: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                💡 <strong>Hint / Output Format:</strong> {problem.expected_output_hint}
              </div>
            )}
          </div>

          {/* Existing or New Submission Auto-Graded Status Card */}
          {existingSubmission && (
            <div style={{
              background: existingSubmission.status === 'PASSED' ? 'rgba(22, 163, 74, 0.07)' : 'rgba(217, 119, 6, 0.08)',
              border: `1.5px solid ${existingSubmission.status === 'PASSED' ? 'rgba(22, 163, 74, 0.3)' : 'rgba(217, 119, 6, 0.3)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  color: existingSubmission.status === 'PASSED' ? '#16A34A' : '#D97706'
                }}>
                  <CheckCircle2 size={17} /> Automated Mark Result: {existingSubmission.status}
                </span>
                <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>
                  Score: {existingSubmission.score} / {problem.points} Marks
                </span>
              </div>
              {existingSubmission.staff_feedback && (
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'flex-start', marginTop: '6px' }}>
                  <MessageSquare size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--blue-vibrant)' }} />
                  <div>
                    <strong>System & Instructor Notes:</strong> {existingSubmission.staff_feedback}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Code Solution Editor */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileCode size={15} color="var(--blue-vibrant)" /> Your Code Solution (Python / Django)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>Supports Tab indentation</span>
                <button
                  type="button"
                  onClick={handleRunTest}
                  disabled={testing || !canSubmit}
                  className="btn-secondary"
                  style={{
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    borderColor: 'var(--blue-border)',
                    color: 'var(--blue-primary)',
                    background: 'var(--blue-soft)'
                  }}
                >
                  <Terminal size={13} /> {testing ? 'Testing Code Output...' : 'Run & Auto-Test Code'}
                </button>
              </div>
            </div>
            <textarea
              className="code-editor-area"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="def my_view(request): ... or paste your code here"
              disabled={!canSubmit}
              rows={11}
            />
          </div>

          {/* Test Runner Results Panel */}
          {testResult && (
            <div style={{
              background: '#FFFFFF',
              border: `1.5px solid ${testResult.status === 'PASSED' ? 'rgba(22, 163, 74, 0.4)' : 'rgba(217, 119, 6, 0.4)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={16} color={testResult.status === 'PASSED' ? '#16A34A' : '#D97706'} />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>
                    Automated Test Runner Output
                  </strong>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontWeight: 800, fontSize: '13px', color: testResult.status === 'PASSED' ? '#16A34A' : '#D97706' }}>
                  Auto-Grade: {testResult.score} / {testResult.max_points} ({testResult.status})
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {(testResult.details || []).map((detail, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {detail.startsWith('[Passed]') ? (
                      <CheckSquare size={14} color="#16A34A" style={{ flexShrink: 0 }} />
                    ) : (
                      <XCircle size={14} color="#DC2626" style={{ flexShrink: 0 }} />
                    )}
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Log / Terminal Output Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
              Terminal Output / Verification Log (Optional)
            </label>
            <textarea
              style={{
                width: '100%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                padding: '10px 14px',
                fontSize: '13px',
                outline: 'none',
                minHeight: '60px'
              }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Output: HTTP/1.1 200 OK or test assertions passed..."
              disabled={!canSubmit}
            />
          </div>

          {/* Alert feedback */}
          {errorMsg && (
            <div style={{
              background: 'var(--coral-soft)',
              color: 'var(--coral)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}>
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(22, 163, 74, 0.1)',
              color: '#16A34A',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              fontWeight: 600
            }}>
              <Check size={16} /> {successMsg}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleRunTest}
              disabled={!canSubmit || testing}
              style={{ fontWeight: 700, borderColor: 'var(--blue-border)', color: 'var(--blue-primary)', background: 'var(--blue-soft)' }}
            >
              <Terminal size={14} />
              {testing ? 'Testing...' : 'Run Tests'}
            </button>

            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              title={!canSubmit ? 'This challenge is locked or deadline has expired' : ''}
            >
              <Play size={14} fill="currentColor" />
              {submitting ? 'Auto-Grading & Submitting...' : existingSubmission ? 'Resubmit & Auto-Grade' : 'Submit for Auto-Grading'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
