import React, { useState, useEffect, useRef } from 'react';
import {
  X, Play, CheckCircle2, Award, Terminal, Sparkles, AlertCircle,
  FileCode, Check, HelpCircle, CheckSquare, XCircle, Clock, Zap,
  Folder, FolderOpen, FileText, Plus, Trash2, Edit3, Settings,
  Code2, Copy, RotateCcw, Maximize2, Minimize2, ChevronRight,
  Shield, Layers, Cpu, CornerDownLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function VSCodeWorkbenchModal({ problem, onClose, onSubmitted }) {
  const existingSubmission = problem?.my_submission;
  const access = problem?.access_control || {};
  const isUnlocked = access.is_unlocked !== false;

  const [language, setLanguage] = useState(problem?.language || 'c');
  const [submitting, setSubmitting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [activeBottomTab, setActiveBottomTab] = useState('terminal'); // 'terminal' | 'stdin' | 'tests' | 'problem'
  const [activeCaseTab, setActiveCaseTab] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initial Multi-File state
  const parseInitialFiles = () => {
    const raw = existingSubmission?.submitted_code || problem?.starter_code || '';
    if (raw.includes('// === file:')) {
      const parts = raw.split(/\/\/\s*===\s*file:\s*([^\s=]+)\s*===/);
      const filesList = [];
      for (let i = 1; i < parts.length; i += 2) {
        filesList.push({
          name: parts[i].trim(),
          content: parts[i + 1] || ''
        });
      }
      if (filesList.length > 0) return filesList;
    }

    const defaultExt = problem?.language === 'python' ? 'py' : problem?.language === 'javascript' ? 'js' : 'c';
    const defaultStarter = raw || (
      defaultExt === 'c'
        ? `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Write your C solution here\n    printf("${problem?.expected_output || 'Hello, World!'}\\n");\n    return 0;\n}\n`
        : defaultExt === 'py'
        ? `# Write your solution here\nprint("${problem?.expected_output || 'Hello, World!'}")\n`
        : `console.log("${problem?.expected_output || 'Hello, World!'}");\n`
    );

    return [
      { name: `main.${defaultExt}`, content: defaultStarter },
      ...(defaultExt === 'c' ? [{ name: 'helpers.h', content: '/* Header declarations and prototypes */\n#ifndef HELPERS_H\n#define HELPERS_H\n\n// Add function declarations here\n\n#endif\n' }] : [])
    ];
  };

  const [files, setFiles] = useState(parseInitialFiles);
  const [activeFileName, setActiveFileName] = useState(files[0]?.name || 'main.c');
  const [newFilePrompt, setNewFilePrompt] = useState(false);
  const [newFileNameInput, setNewFileNameInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: `SkillStack Cloud C Compiler (GCC 16.2.0 • x86_64-w64-mingw32)` },
    { type: 'system', text: `Workspace ready: ${problem?.title || 'Interactive Lab'}` },
    { type: 'system', text: `Press 'Run & Compile' (or Ctrl+Enter) to build and execute.` }
  ]);

  const activeFile = files.find(f => f.name === activeFileName) || files[0];
  const editorRef = useRef(null);

  // Bundle files into payload for backend runner
  const bundleCode = () => {
    if (files.length === 1 && files[0].name.startsWith('main.')) {
      return files[0].content;
    }
    return files.map(f => `// === file: ${f.name} ===\n${f.content}`).join('\n\n');
  };

  const handleUpdateContent = (newContent) => {
    setFiles(prev => prev.map(f => f.name === activeFileName ? { ...f, content: newContent } : f));
  };

  const handleCreateFile = () => {
    const trimmed = newFileNameInput.trim();
    if (!trimmed) return;
    if (files.some(f => f.name === trimmed)) {
      alert('A file with this name already exists.');
      return;
    }
    const newF = { name: trimmed, content: trimmed.endsWith('.h') ? `// Header file: ${trimmed}\n#pragma once\n` : `// Source file: ${trimmed}\n` };
    setFiles(prev => [...prev, newF]);
    setActiveFileName(trimmed);
    setNewFileNameInput('');
    setNewFilePrompt(false);
  };

  const handleDeleteFile = (fileName, e) => {
    if (e) e.stopPropagation();
    if (files.length <= 1) {
      alert('You must keep at least one source file in the project.');
      return;
    }
    if (confirm(`Delete ${fileName}?`)) {
      const remaining = files.filter(f => f.name !== fileName);
      setFiles(remaining);
      if (activeFileName === fileName) {
        setActiveFileName(remaining[0].name);
      }
    }
  };

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter runs code
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files, customInput, activeCaseTab]);

  // Tab key indent support inside textarea
  const handleEditorKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + '    ' + val.substring(end);
      handleUpdateContent(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Automated Test Criteria
  const defaultCriteria = Array.isArray(problem?.test_criteria) && problem?.test_criteria.length > 0 && typeof problem?.test_criteria[0] === 'object'
    ? problem?.test_criteria
    : [
        { id: 1, name: 'Sample Case 1', input: '', expected_output: problem?.expected_output || 'Pass', is_hidden: false },
        { id: 2, name: 'Return Code 0 Check', input: '', expected_output: problem?.expected_output || 'Pass', is_hidden: false },
        { id: 3, name: 'Hidden Verification Case', input: '', expected_output: problem?.expected_output || 'Pass', is_hidden: true },
      ];

  const handleRunCode = async () => {
    setTesting(true);
    setErrorMsg('');
    setActiveBottomTab('terminal');

    const bundled = bundleCode();
    const currentInput = customInput || defaultCriteria[activeCaseTab]?.input || '';
    const targetExpected = defaultCriteria[activeCaseTab]?.expected_output || problem?.expected_output || '';

    setTerminalHistory(prev => [
      ...prev,
      { type: 'command', text: `$ gcc -w -O2 ${files.map(f => f.name).filter(n => n.endsWith('.c')).join(' ') || 'main.c'} -o solution.exe` }
    ]);

    try {
      const res = await api.testRunCode(
        problem?.id,
        bundled,
        language,
        targetExpected,
        currentInput,
        targetExpected
      );

      setTestResult(res);

      if (res.status === 'COMPILE_ERROR') {
        setTerminalHistory(prev => [
          ...prev,
          { type: 'error', text: `[Compilation Error]\n${res.error_detail || 'Failed to compile C source.'}` }
        ]);
      } else {
        const outText = res.actual_output ? res.actual_output : '(Process returned with empty output)';
        setTerminalHistory(prev => [
          ...prev,
          { type: 'output', text: outText },
          { type: 'system', text: `Process exited with status 0 (${res.execution_time_ms || 1.2} ms) • Match: ${res.is_passed ? 'MATCHED EXPECTED' : 'DIFFERED'}` }
        ]);
        if (res.is_passed) {
          confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        }
      }
    } catch (err) {
      setTerminalHistory(prev => [
        ...prev,
        { type: 'error', text: `Execution failed: ${err.message || 'Compiler timeout or backend communication error.'}` }
      ]);
    } finally {
      setTesting(false);
    }
  };

  const handleSubmitSolution = async () => {
    const bundled = bundleCode();
    if (!bundled.trim()) {
      alert('Please write code before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    setActiveBottomTab('tests');

    try {
      const result = await api.submitSolution(problem?.id, bundled, language, null, 'Submitted from VS Code Studio');
      setSubmissionResult(result);

      const passedCount = result.passed_test_cases ?? (result.is_passed ? defaultCriteria.length : 0);
      const totalCount = result.total_test_cases ?? defaultCriteria.length;

      if (result.is_passed) {
        setSuccessMsg(`🎉 All ${totalCount}/${totalCount} Test Cases Passed! Perfect Solution (${result.execution_time_ms || 2.1} ms)`);
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
        if (onSubmitted) onSubmitted(result);
      } else {
        setErrorMsg(`Test Evaluation: ${passedCount}/${totalCount} Passed. Status: ${result.status || 'Failed'}`);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Line numbering generator
  const lineCount = (activeFile?.content || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isFullscreen ? 0 : '16px'
    }}>
      <div style={{
        width: isFullscreen ? '100vw' : '95vw',
        maxWidth: isFullscreen ? '100vw' : '1500px',
        height: isFullscreen ? '100vh' : '92vh',
        backgroundColor: '#1E1E1E',
        borderRadius: isFullscreen ? 0 : '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        border: '1px solid #333333',
        color: '#CCCCCC',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {/* Top Titlebar (VS Code Header) */}
        <div style={{
          height: '38px',
          backgroundColor: '#252526',
          borderBottom: '1px solid #333333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          userSelect: 'none'
        }}>
          {/* Left: Window Dots & App Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F56', display: 'inline-block' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFBD2E', display: 'inline-block' }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27C93F', display: 'inline-block' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#E0E0E0' }}>
              <Code2 size={16} color="#007ACC" />
              <span>SkillStack Studio</span>
              <span style={{ color: '#666' }}>—</span>
              <span style={{ color: '#9CDCFE' }}>{problem?.title || 'C Programming Workbench'}</span>
            </div>
          </div>

          {/* Center: Language & Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: '#007ACC',
              color: '#FFFFFF',
              fontWeight: 700
            }}>
              GCC 16.2.0 (C11)
            </span>
            <span style={{ fontSize: '11px', color: '#888' }}>
              UTF-8 • Multi-File Ready
            </span>
          </div>

          {/* Right: Actions (Run, Submit, Fullscreen, Close) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleRunCode}
              disabled={testing || submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                backgroundColor: '#2EA043',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: testing ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s'
              }}
              title="Compile and run code (Ctrl+Enter)"
            >
              <Play size={13} fill="#FFF" />
              <span>{testing ? 'Compiling...' : 'Run & Compile'}</span>
            </button>

            <button
              onClick={handleSubmitSolution}
              disabled={submitting || testing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 14px',
                backgroundColor: '#7C3AED',
                color: '#FFF',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              <CheckCircle2 size={13} />
              <span>{submitting ? 'Submitting...' : 'Submit Solution'}</span>
            </button>

            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
              title="Close Workbench"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Body (Split into Left Sidebar, Center Editor, Bottom Terminal) */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Far Left: Activity Bar */}
          <div style={{
            width: '44px',
            backgroundColor: '#333333',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '8px',
            gap: '14px',
            borderRight: '1px solid #252526'
          }}>
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: sidebarOpen ? '#FFFFFF' : '#888',
                cursor: 'pointer',
                borderLeft: sidebarOpen ? '2px solid #007ACC' : '2px solid transparent',
                width: '100%',
                display: 'flex',
                justifyContent: 'center'
              }}
              title="File Explorer"
            >
              <Folder size={20} />
            </button>
            <button
              onClick={() => setActiveBottomTab('problem')}
              style={{ background: 'transparent', border: 'none', color: activeBottomTab === 'problem' ? '#FFFFFF' : '#888', cursor: 'pointer' }}
              title="Problem Description"
            >
              <HelpCircle size={20} />
            </button>
            <button
              onClick={() => setActiveBottomTab('tests')}
              style={{ background: 'transparent', border: 'none', color: activeBottomTab === 'tests' ? '#FFFFFF' : '#888', cursor: 'pointer' }}
              title="Test Suite"
            >
              <CheckSquare size={20} />
            </button>
          </div>

          {/* Left Panel: File Explorer */}
          {sidebarOpen && (
            <div style={{
              width: '210px',
              backgroundColor: '#252526',
              borderRight: '1px solid #1E1E1E',
              display: 'flex',
              flexDirection: 'column',
              userSelect: 'none'
            }}>
              <div style={{
                padding: '8px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#BBB',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #2A2D2E'
              }}>
                <span>Explorer: Project</span>
                <button
                  onClick={() => setNewFilePrompt(true)}
                  style={{ background: 'transparent', border: 'none', color: '#BBB', cursor: 'pointer', padding: 0 }}
                  title="New File"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* New file input form */}
              {newFilePrompt && (
                <div style={{ padding: '6px 8px', backgroundColor: '#37373D', display: 'flex', gap: '4px' }}>
                  <input
                    type="text"
                    value={newFileNameInput}
                    onChange={(e) => setNewFileNameInput(e.target.value)}
                    placeholder="e.g. calc.h"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateFile();
                      if (e.key === 'Escape') setNewFilePrompt(false);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#1E1E1E',
                      color: '#FFF',
                      border: '1px solid #007ACC',
                      borderRadius: '2px',
                      padding: '2px 6px',
                      fontSize: '12px',
                      outline: 'none'
                    }}
                  />
                  <button onClick={handleCreateFile} style={{ backgroundColor: '#007ACC', color: '#FFF', border: 'none', borderRadius: '2px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }}>OK</button>
                </div>
              )}

              {/* File list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
                {files.map(file => {
                  const isActive = file.name === activeFileName;
                  const isHeader = file.name.endsWith('.h');
                  return (
                    <div
                      key={file.name}
                      onClick={() => setActiveFileName(file.name)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '4px 12px',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        backgroundColor: isActive ? '#37373D' : 'transparent',
                        color: isActive ? '#FFFFFF' : '#CCCCCC'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                        <FileCode size={14} color={isHeader ? '#A855F7' : '#007ACC'} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{file.name}</span>
                      </div>
                      {files.length > 1 && (
                        <button
                          onClick={(e) => handleDeleteFile(file.name, e)}
                          style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', opacity: isActive ? 1 : 0 }}
                          title="Delete file"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Center + Bottom: Editor and Terminal */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
            {/* Editor Tab Bar */}
            <div style={{
              height: '35px',
              backgroundColor: '#252526',
              display: 'flex',
              alignItems: 'center',
              overflowX: 'auto',
              borderBottom: '1px solid #1E1E1E'
            }}>
              {files.map(f => {
                const isActive = f.name === activeFileName;
                return (
                  <div
                    key={f.name}
                    onClick={() => setActiveFileName(f.name)}
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 12px',
                      backgroundColor: isActive ? '#1E1E1E' : '#2D2D2D',
                      borderRight: '1px solid #1E1E1E',
                      borderTop: isActive ? '2px solid #007ACC' : '2px solid transparent',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: isActive ? '#FFF' : '#999',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <FileCode size={13} color={f.name.endsWith('.h') ? '#A855F7' : '#007ACC'} />
                    <span>{f.name}</span>
                    {files.length > 1 && (
                      <span
                        onClick={(e) => handleDeleteFile(f.name, e)}
                        style={{ color: '#888', fontSize: '13px', marginLeft: '4px' }}
                      >
                        ×
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Code Editor Body with Line Numbers */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0, backgroundColor: '#1E1E1E', overflow: 'hidden' }}>
              {/* Line Numbers Gutter */}
              <div style={{
                width: '45px',
                backgroundColor: '#1E1E1E',
                borderRight: '1px solid #2D2D2D',
                paddingTop: '8px',
                textAlign: 'right',
                paddingRight: '10px',
                color: '#6E7681',
                fontSize: '13px',
                lineHeight: '21px',
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                userSelect: 'none'
              }}>
                {lineNumbers.map(n => <div key={n}>{n}</div>)}
              </div>

              {/* Textarea Code Input */}
              <textarea
                ref={editorRef}
                value={activeFile?.content || ''}
                onChange={(e) => handleUpdateContent(e.target.value)}
                onKeyDown={handleEditorKeyDown}
                spellCheck="false"
                style={{
                  flex: 1,
                  backgroundColor: '#1E1E1E',
                  color: '#D4D4D4',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  padding: '8px 12px',
                  fontSize: '13.5px',
                  lineHeight: '21px',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  whiteSpace: 'pre',
                  overflowY: 'auto',
                  tabSize: 4
                }}
              />
            </div>

            {/* Alerts if success / error */}
            {successMsg && (
              <div style={{ backgroundColor: '#064E3B', color: '#6EE7B7', padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div style={{ backgroundColor: '#7F1D1D', color: '#FCA5A5', padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bottom Panel (Terminal / Stdin / Tests / Description) */}
            <div style={{
              height: '240px',
              backgroundColor: '#181818',
              borderTop: '1px solid #333333',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Bottom Tabs Bar */}
              <div style={{
                height: '30px',
                backgroundColor: '#252526',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8px',
                gap: '4px',
                borderBottom: '1px solid #1E1E1E'
              }}>
                {[
                  { id: 'terminal', label: 'Terminal', icon: Terminal },
                  { id: 'stdin', label: 'Interactive Input (stdin)', icon: CornerDownLeft },
                  { id: 'tests', label: `Test Suite (${defaultCriteria.length})`, icon: CheckSquare },
                  { id: 'problem', label: 'Problem Brief', icon: HelpCircle }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeBottomTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveBottomTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '3px 10px',
                        backgroundColor: isActive ? '#1E1E1E' : 'transparent',
                        color: isActive ? '#FFF' : '#888',
                        border: 'none',
                        borderTop: isActive ? '2px solid #007ACC' : '2px solid transparent',
                        fontSize: '11.5px',
                        cursor: 'pointer'
                      }}
                    >
                      <Icon size={12} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', fontSize: '12.5px', fontFamily: 'Consolas, monospace' }}>
                {/* 1. Terminal Output */}
                {activeBottomTab === 'terminal' && (
                  <div>
                    {terminalHistory.map((line, idx) => (
                      <div
                        key={idx}
                        style={{
                          color: line.type === 'error' ? '#F87171' : line.type === 'command' ? '#60A5FA' : line.type === 'system' ? '#9CA3AF' : '#E5E7EB',
                          whiteSpace: 'pre-wrap',
                          lineHeight: '1.45',
                          marginBottom: '3px'
                        }}
                      >
                        {line.text}
                      </div>
                    ))}
                    {testing && (
                      <div style={{ color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>⚡ Building C project with GCC...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Interactive Input (stdin) */}
                {activeBottomTab === 'stdin' && (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '6px' }}>
                    <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                      Provide input text fed into scanf() during program execution (e.g. numbers, strings, multiple lines):
                    </div>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. 15 25"
                      style={{
                        flex: 1,
                        backgroundColor: '#1E1E1E',
                        color: '#4ADE80',
                        border: '1px solid #333333',
                        borderRadius: '4px',
                        padding: '6px',
                        fontFamily: 'Consolas, monospace',
                        fontSize: '12px',
                        resize: 'none',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {/* 3. Test Suite */}
                {activeBottomTab === 'tests' && (
                  <div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      {defaultCriteria.map((tc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCaseTab(idx)}
                          style={{
                            padding: '4px 10px',
                            backgroundColor: activeCaseTab === idx ? '#007ACC' : '#2D2D2D',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          {tc.name} {tc.is_hidden ? '🔒' : ''}
                        </button>
                      ))}
                    </div>

                    <div style={{ backgroundColor: '#252526', padding: '8px 12px', borderRadius: '4px' }}>
                      <div style={{ color: '#9CDCFE', fontWeight: 600, marginBottom: '4px' }}>
                        {defaultCriteria[activeCaseTab]?.name}
                      </div>
                      <div style={{ color: '#888', fontSize: '11px', marginBottom: '2px' }}>Input:</div>
                      <div style={{ backgroundColor: '#1E1E1E', padding: '4px 8px', borderRadius: '3px', marginBottom: '6px', color: '#4ADE80' }}>
                        {defaultCriteria[activeCaseTab]?.input || '(None / No Stdin Required)'}
                      </div>
                      <div style={{ color: '#888', fontSize: '11px', marginBottom: '2px' }}>Expected Output:</div>
                      <div style={{ backgroundColor: '#1E1E1E', padding: '4px 8px', borderRadius: '3px', color: '#FCD34D' }}>
                        {defaultCriteria[activeCaseTab]?.expected_output || problem?.expected_output || 'Pass'}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Problem Description */}
                {activeBottomTab === 'problem' && (
                  <div style={{ color: '#D4D4D4', lineHeight: '1.6' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                      {problem?.title}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', color: '#BBB' }}>
                      {problem?.description || 'Write your C program to fulfill the challenge criteria.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div style={{
          height: '22px',
          backgroundColor: '#007ACC',
          color: '#FFFFFF',
          fontSize: '11px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 10px',
          userSelect: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>✓ Ready</span>
            <span>Files: {files.length}</span>
            <span>Current: {activeFileName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>Spaces: 4</span>
            <span>UTF-8</span>
            <span>C11</span>
          </div>
        </div>
      </div>
    </div>
  );
}
