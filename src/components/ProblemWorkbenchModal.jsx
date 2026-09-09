import React, { useState } from 'react';
import {
  X, Play, CheckCircle2, Award, MessageSquare, AlertCircle,
  FileCode, Check, Terminal, Sparkles, HelpCircle, CheckSquare, XCircle, Clock, Zap
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

  const canSubmit = isUnlocked && (!isExpired || access.allow_late_submission);

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '900px', width: '94%' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="lab-number" style={{ textTransform: 'uppercase' }}>
                {language}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {problem.topic_title}
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
                {problem.points || 10} Points &bull; Sandboxed Output Auto-Validation
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
            marginBottom: '18px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-primary)' }}>Problem Statement &amp; Requirements:</h4>
            <RichContentRenderer content={problem.description} />

            {problem.expected_output && (
              <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--blue-primary)', background: 'var(--blue-soft)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--blue-border)' }}>
                <span style={{ fontWeight: 800, display: 'block', marginBottom: '4px' }}>🎯 Expected Terminal Output (Answer Key):</span>
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
                  <FileCode size={15} color="var(--blue-vibrant)" /> Source Code Editor
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
                    fontWeight: 700,
                    borderColor: 'var(--blue-border)',
                    color: 'var(--blue-primary)',
                    background: 'var(--blue-soft)'
                  }}
                >
                  <Terminal size={14} /> {testing ? 'Compiling & Running…' : 'Run Code (Live Output)'}
                </button>
              </div>
            </div>

            <textarea
              className="code-editor-area"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write your code here..."
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
                resize: 'vertical'
              }}
            />
          </div>

          {/* Test Runner Results Panel */}
          {testResult && (
            <div style={{
              background: testResult.is_passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              border: `1.5px solid ${testResult.is_passed ? '#10B981' : '#EF4444'}`,
              borderRadius: 'var(--radius-md)',
              padding: '16px 18px',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {testResult.is_passed ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <XCircle size={18} color="#EF4444" />
                  )}
                  <strong style={{ fontSize: '14px', color: testResult.is_passed ? '#047857' : '#B91C1C' }}>
                    {testResult.is_passed ? 'MATCH: Actual output equals expected output!' : `Status: ${testResult.status}`}
                  </strong>
                </div>
                <div style={{ fontFamily: 'IBM Plex Mono', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {testResult.execution_time_ms} ms
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
    </div>
  );
}
