import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Lock, Unlock, Clock, ArrowRight, ArrowLeft,
  Copy, Check, Award, Play, Sparkles, BookOpen, Layers, Code,
  Terminal, Search, Filter, Edit3, Save, Zap, X, HelpCircle,
  ExternalLink, RotateCcw, CheckCircle, FileText
} from 'lucide-react';
import CountdownTimer from '../components/CountdownTimer';
import ProblemWorkbenchModal from '../components/ProblemWorkbenchModal';
import RichContentRenderer from '../components/RichContentRenderer';

export default function StudentPortal({ curriculum, user, onRefresh, currentSubject, onBackToCourses }) {
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [activeTab, setActiveTab] = useState('notes_content'); // 'notes_content' | 'code' | 'notes' | 'labs'
  
  // Search and filter in syllabus
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all'); // 'all' | 'beginner' | 'intermediate' | 'advanced' | 'lab_open'

  // Personal Notes state
  const [notes, setNotes] = useState('');
  const [noteSavedTime, setNoteSavedTime] = useState(null);

  const [readTopics, setReadTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('kalari_read_topics');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Flatten all topics for easy navigation
  const flatTopics = [];
  curriculum.forEach(module => {
    (module.topics || []).forEach(topic => {
      flatTopics.push({
        ...topic,
        moduleName: module.name,
        level: module.level,
      });
    });
  });

  // Set default active topic on initial load
  useEffect(() => {
    if (flatTopics.length > 0) {
      if (!activeTopicId || !flatTopics.some(t => t.topic_id === activeTopicId)) {
        setActiveTopicId(flatTopics[0].topic_id);
      }
    }
  }, [flatTopics.length, currentSubject?.id]);

  const activeTopic = flatTopics.find(t => t.topic_id === activeTopicId) || flatTopics[0];
  const activeIdx = flatTopics.findIndex(t => t.topic_id === activeTopicId);
  const prevTopic = activeIdx > 0 ? flatTopics[activeIdx - 1] : null;
  const nextTopic = activeIdx < flatTopics.length - 1 ? flatTopics[activeIdx + 1] : null;

  // Load saved notes when topic changes
  useEffect(() => {
    if (activeTopic) {
      const savedNotes = localStorage.getItem(`kalari_topic_notes_${activeTopic.topic_id}`) || '';
      setNotes(savedNotes);
      setNoteSavedTime(savedNotes ? 'Saved in local storage' : null);
    }
  }, [activeTopicId]);

  const saveNotes = (content) => {
    setNotes(content);
    if (activeTopic) {
      localStorage.setItem(`kalari_topic_notes_${activeTopic.topic_id}`, content);
      setNoteSavedTime(`Saved at ${new Date().toLocaleTimeString()}`);
    }
  };

  const insertNoteTemplate = (type) => {
    let template = '';
    if (type === 'concept') {
      template = `\n### 💡 Key Concept Takeaway:\n- Core Idea: \n- Key Point: \n`;
    } else if (type === 'code') {
      template = `\n\`\`\`python\n# Personal Code Note:\n\n\`\`\`\n`;
    }
    saveNotes(notes + template);
  };

  const toggleTopicRead = (tid) => {
    const updated = { ...readTopics, [tid]: !readTopics[tid] };
    setReadTopics(updated);
    localStorage.setItem('kalari_read_topics', JSON.stringify(updated));
  };

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyCheat = (text, key) => {
    navigator.clipboard.writeText(text);
    setCheatCopied(key);
    setTimeout(() => setCheatCopied(null), 2000);
  };

  const levelColor = {
    beginner: '#16A34A',
    intermediate: '#D97706',
    advanced: '#DC2626'
  };

  const getDiagramType = (tid) => {
    if (tid === 'models' || tid === 'queryset') return 'orm-pipeline';
    if (tid === 'drf') return 'drf-serializer';
    return 'mvt-cycle';
  };

  // Filter topics for the sidebar
  const filteredCurriculum = curriculum.map(mod => {
    const matchingTopics = (mod.topics || []).filter(topic => {
      // Search query check
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        topic.title.toLowerCase().includes(q) || 
        mod.name.toLowerCase().includes(q) ||
        (topic.explain || []).some(p => p.toLowerCase().includes(q));

      // Level check
      let matchesLevel = true;
      if (levelFilter !== 'all') {
        if (levelFilter === 'lab_open') {
          matchesLevel = (topic.problems || []).some(p => p.access_control?.is_active_now);
        } else {
          matchesLevel = mod.level === levelFilter;
        }
      }

      return matchesSearch && matchesLevel;
    });

    return { ...mod, filteredTopics: matchingTopics };
  }).filter(mod => mod.filteredTopics.length > 0);

  const completedCount = flatTopics.filter(t => readTopics[t.topic_id]).length;
  const progressPct = flatTopics.length > 0 ? Math.round((completedCount / flatTopics.length) * 100) : 0;

  return (
    <div className="app-container">
      {/* =========================================================================
          SIDEBAR NAVIGATION WITH SEARCH & FILTERS
          ========================================================================= */}
      <aside className="app-sidebar" style={{ background: '#FFFFFF' }}>
        {/* Track Header with Switch button */}
        <div style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
          marginBottom: '12px',
          borderRadius: 'var(--radius-md)'
        }}>
          {onBackToCourses && (
            <button
              className="btn-secondary"
              onClick={onBackToCourses}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '11.5px',
                marginBottom: '10px',
                justifyContent: 'center',
                gap: '6px',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <ArrowLeft size={13} /> Switch Subject Track
            </button>
          )}
          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.08em' }}>
            Current Subject Track
          </div>
          <div style={{ fontSize: '14.5px', fontWeight: 800, color: 'var(--blue-primary)', marginTop: '2px', lineHeight: 1.3 }}>
            {currentSubject?.name || 'Django Full Stack Mastery'}
          </div>

          {/* Track Progress Bar */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Curriculum Mastery</span>
              <span style={{ color: '#7B1C6E' }}>{completedCount} / {flatTopics.length} ({progressPct}%)</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#F0E2EE', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'linear-gradient(90deg, #7B1C6E, #FDC029)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>

        {/* Search Bar in Sidebar */}
        <div style={{ padding: '0 4px 12px' }}>
          <div style={{ position: 'relative', marginBottom: '8px' }}>
            <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search syllabus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 28px 7px 30px',
                fontSize: '12px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '8px', top: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Level Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {['all', 'beginner', 'intermediate', 'advanced', 'lab_open'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                style={{
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: levelFilter === lvl ? '#7B1C6E' : '#E2E8F0',
                  background: levelFilter === lvl ? 'rgba(123, 28, 110, 0.1)' : '#FFFFFF',
                  color: levelFilter === lvl ? '#7B1C6E' : '#64748B',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {lvl === 'all' ? 'All' : lvl === 'lab_open' ? '⚡ Lab Open' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Topic List */}
        {filteredCurriculum.length === 0 ? (
          <div style={{ padding: '24px 12px', textAlign: 'center', color: '#94A3B8', fontSize: '12.5px' }}>
            No topics matched your search filter.
          </div>
        ) : (
          filteredCurriculum.map(mod => (
            <div key={mod.id} className="module-group" style={{ marginBottom: '16px' }}>
              <div className="module-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>{mod.name}</span>
                <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(123, 28, 110, 0.08)', color: '#7B1C6E', fontWeight: 800 }}>
                  {mod.level.toUpperCase()}
                </span>
              </div>
              {mod.filteredTopics.map(topic => {
                const isActive = topic.topic_id === activeTopicId;
                const isRead = !!readTopics[topic.topic_id];
                const hasUnlockedProblem = (topic.problems || []).some(p => p.access_control?.is_active_now);

                return (
                  <div
                    key={topic.id}
                    className={`topic-row ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTopicId(topic.topic_id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isActive ? 'rgba(123, 28, 110, 0.08)' : 'transparent',
                      borderLeft: isActive ? '3px solid #7B1C6E' : '3px solid transparent'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span style={{
                        width: '16px', height: '16px', borderRadius: '4px',
                        border: `1.5px solid ${isRead ? '#16A34A' : '#CBD5E1'}`,
                        background: isRead ? '#16A34A' : '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '10px', color: '#FFFFFF', fontWeight: 800
                      }}>
                        {isRead ? '✓' : ''}
                      </span>
                      <span style={{
                        fontSize: '12.5px',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#7B1C6E' : '#0F172A',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden'
                      }}>
                        {topic.title}
                      </span>
                    </div>

                    {hasUnlockedProblem && (
                      <span style={{
                        fontSize: '9px',
                        background: 'rgba(217, 119, 6, 0.1)',
                        color: '#D97706',
                        border: '1px solid rgba(217, 119, 6, 0.3)',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        flexShrink: 0
                      }}>
                        LAB OPEN
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </aside>

      {/* =========================================================================
          MAIN LESSON & LABS WORKBENCH
          ========================================================================= */}
      <main className="app-main" style={{ background: '#F8FAFC', padding: '32px' }}>
        {activeTopic ? (
          <div>
            {/* Topic Hero Header with Badges */}
            <div className="topic-hero" style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(123, 28, 110, 0.14)',
              borderRadius: '24px',
              padding: '28px 32px',
              boxShadow: '0 10px 30px rgba(0, 60, 160, 0.05)',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                  <span style={{
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(123, 28, 110, 0.08)',
                    color: levelColor[activeTopic.level] || '#7B1C6E',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}>
                    {activeTopic.level} LEVEL
                  </span>
                  <span style={{ color: '#CBD5E1' }}>&bull;</span>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>{activeTopic.moduleName}</span>
                  <span style={{ color: '#CBD5E1' }}>&bull;</span>
                  <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> ~8 min read
                  </span>
                </div>

                {/* Quick Utility Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setShowCheatsheet(true)}
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      borderColor: 'rgba(123, 28, 110, 0.2)',
                      color: '#7B1C6E',
                      background: 'rgba(123, 28, 110, 0.04)'
                    }}
                  >
                    <Zap size={13} /> Cheat Sheet
                  </button>

                  <button
                    className={`btn-secondary ${readTopics[activeTopic.topic_id] ? 'active-read' : ''}`}
                    onClick={() => toggleTopicRead(activeTopic.topic_id)}
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      borderColor: readTopics[activeTopic.topic_id] ? '#16A34A' : '#CBD5E1',
                      color: readTopics[activeTopic.topic_id] ? '#16A34A' : '#0F172A',
                      background: readTopics[activeTopic.topic_id] ? 'rgba(22, 163, 74, 0.08)' : '#FFFFFF'
                    }}
                  >
                    <CheckCircle2 size={14} color={readTopics[activeTopic.topic_id] ? '#16A34A' : 'currentColor'} />
                    {readTopics[activeTopic.topic_id] ? 'Completed' : 'Mark Complete'}
                  </button>
                </div>
              </div>

              <h1 className="topic-title" style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '4px 0 8px' }}>
                {activeTopic.title}
              </h1>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Explore study notes, practical code implementations, and interactive test sandboxes.
              </p>
            </div>

            {/* Content Tabs */}
            <div className="content-tabs" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button
                className={`content-tab-btn ${activeTab === 'notes_content' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes_content')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}
              >
                <BookOpen size={14} color="#D97706" /> Study Notes
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}
              >
                <Code size={14} color="#7B1C6E" /> Practical Code ({activeTopic.examples?.length || 0})
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}
              >
                <Edit3 size={14} color="#8B5CF6" /> My Notes
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
                onClick={() => setActiveTab('labs')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 700 }}
              >
                <Layers size={14} color="#16A34A" /> Practice Labs ({activeTopic.problems?.length || 0})
              </button>
            </div>

            {/* =========================================================================
                TAB 1: Study Notes (admin notes_content markdown & uploaded images)
                ========================================================================= */}
            {activeTab === 'notes_content' && (
              <div className="explain-card" style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(123, 28, 110, 0.12)',
                borderRadius: '24px',
                padding: '28px 32px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
                marginBottom: '28px'
              }}>
                {activeTopic.notes_content && activeTopic.notes_content.trim() ? (
                  <RichContentRenderer content={activeTopic.notes_content} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>📝</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#64748B' }}>No study notes added yet for this topic.</div>
                    <div style={{ fontSize: '12.5px', marginTop: '6px' }}>Notes added in Django Admin will appear here dynamically.</div>
                  </div>
                )}

                {/* Topic Images Gallery */}
                {activeTopic.images && activeTopic.images.length > 0 && (
                  <div style={{ marginTop: '24px', borderTop: '1px solid rgba(123, 28, 110, 0.1)', paddingTop: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#7B1C6E', background: 'rgba(123,28,110,0.07)', padding: '4px 12px', borderRadius: '20px' }}>
                        🖼️ Visual References &amp; Diagrams
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                      {activeTopic.images.map((img, idx) => (
                        <div
                          key={img.id || idx}
                          style={{ flex: '1 1 280px', maxWidth: '420px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid rgba(123,28,110,0.12)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', background: '#FAFAFA', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                          onClick={() => window.open(img.image_url, '_blank')}
                          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                        >
                          <img
                            src={img.image_url}
                            alt={img.caption || `Diagram ${idx + 1}`}
                            style={{ width: '100%', display: 'block', maxHeight: '280px', objectFit: 'contain', background: '#fff', padding: '8px' }}
                            loading="lazy"
                          />
                          {img.caption && (
                            <div style={{ padding: '10px 14px', fontSize: '12.5px', color: '#475569', fontStyle: 'italic', borderTop: '1px solid rgba(123,28,110,0.08)', background: '#FFF' }}>
                              📌 {img.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                TAB 2: Practical Code Examples
                ========================================================================= */}
            {activeTab === 'code' && (
              <div style={{ marginBottom: '36px' }}>
                <div className="section-badge" style={{ marginBottom: '16px' }}>
                  💻 Practical Code Implementation
                </div>
                {activeTopic.examples && activeTopic.examples.length > 0 ? (
                  activeTopic.examples.map((ex, idx) => (
                    <div key={ex.id || idx} className="code-container" style={{ borderRadius: '20px', overflow: 'hidden', border: '1.5px solid rgba(123, 28, 110, 0.18)', marginBottom: '20px' }}>
                      <div className="code-header" style={{ background: '#F1F5F9', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '13px' }}>● {ex.label}</span>
                        <button
                          className="code-copy-btn"
                          onClick={() => copyCode(ex.code, idx)}
                          style={{ fontSize: '11.5px', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check size={12} color="#16A34A" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={12} /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="code-pre" style={{
                        background: '#0B132B',
                        padding: '22px 24px',
                        color: '#E2E8F0',
                        fontSize: '13.5px',
                        lineHeight: 1.7,
                        overflowX: 'auto',
                        margin: 0,
                        fontFamily: "'IBM Plex Mono', Consolas, Monaco, monospace"
                      }}>
                        <code>{ex.code}</code>
                      </pre>
                    </div>
                  ))
                ) : (

                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', background: '#FFFFFF', borderRadius: '20px', border: '1.5px solid rgba(123, 28, 110, 0.12)' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>💻</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#64748B' }}>No code examples added yet for this topic.</div>
                  </div>
                )}
              </div>
            )}


            {/* =========================================================================
                TAB 3: PERSONAL STUDY NOTES (Local student notes)
                ========================================================================= */}
            {activeTab === 'notes' && (
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid rgba(123, 28, 110, 0.18)',
                borderRadius: '24px',
                padding: '24px 28px',
                boxShadow: '0 10px 30px rgba(0, 60, 160, 0.08)',
                marginBottom: '28px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Edit3 size={18} color="#8B5CF6" /> Fellow Personal Study Notes: {activeTopic.title}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0' }}>
                      Your personal mental models, questions, and code snippets. Automatically saved to your local browser storage.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {noteSavedTime && (
                      <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={12} /> {noteSavedTime}
                      </span>
                    )}
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(notes);
                        alert('Notes copied to clipboard!');
                      }}
                      style={{ fontSize: '12px', padding: '5px 12px', borderRadius: 'var(--radius-full)' }}
                    >
                      <Copy size={12} /> Copy Notes
                    </button>
                  </div>
                </div>

                {/* Quick Insert Templates */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', color: '#64748B', alignSelf: 'center', fontWeight: 600 }}>Insert:</span>
                  <button
                    onClick={() => insertNoteTemplate('concept')}
                    style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                  >
                    💡 Key Concept
                  </button>
                  <button
                    onClick={() => insertNoteTemplate('code')}
                    style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                  >
                    💻 Code Block
                  </button>
                  <button
                    onClick={() => insertNoteTemplate('question')}
                    style={{ fontSize: '11.5px', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid #CBD5E1', background: '#F8FAFC', cursor: 'pointer' }}
                  >
                    ❓ Question for Faculty
                  </button>
                </div>

                <textarea
                  value={notes}
                  onChange={(e) => saveNotes(e.target.value)}
                  placeholder="Record your thoughts, explanations in Tamil/English, or mental models here..."
                  rows={14}
                  style={{
                    width: '100%',
                    padding: '16px',
                    fontSize: '13.5px',
                    lineHeight: 1.7,
                    borderRadius: '16px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FAFAFA',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                  <span>Markdown formatting supported (# headings, - lists, `code`)</span>
                  <span>{notes.length} characters</span>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB 4: Practice Labs & Challenges (Access Controlled)
                ========================================================================= */}
            {activeTab === 'labs' && (
              <section className="labs-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '4px', color: '#0F172A' }}>Practice Labs & Challenges</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Solve challenges unlocked by your instructor. Submit before deadline expires.
                    </p>
                  </div>
                </div>


              {(!activeTopic.problems || activeTopic.problems.length === 0) ? (
                <div style={{
                  padding: '36px',
                  textAlign: 'center',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-tertiary)',
                  border: '1px dashed var(--border-medium)'
                }}>
                  No practice problems defined for this topic.
                </div>
              ) : (
                activeTopic.problems.map((problem, pIdx) => {
                  const access = problem.access_control || {};
                  const isUnlocked = access.is_unlocked !== false;
                  const isExpired = Boolean(access.is_expired);
                  const sub = problem.my_submission;
                  const isPassed = sub?.status === 'PASSED';
                  const isSubmitted = sub?.status === 'SUBMITTED';
                  const isRevision = sub?.status === 'REVISION_REQUESTED';

                  return (
                    <div
                      key={problem.id}
                      className={`lab-card ${isUnlocked && !isExpired ? 'active-unlocked' : ''} ${!isUnlocked ? 'locked-state' : ''}`}
                      style={{ background: '#FFFFFF', border: '1.5px solid rgba(123, 28, 110, 0.12)' }}
                    >
                      <div className="lab-card-top">
                        <div className="lab-title-group">
                          <span className="lab-number">LAB #{pIdx + 1}</span>
                          <h3 style={{ fontSize: '17px', color: '#0F172A' }}>{problem.title}</h3>
                        </div>

                        {/* Status Badges */}
                        <div>
                          {isPassed && (
                            <span className="lab-status-badge status-passed">
                              <CheckCircle2 size={13} /> Passed ({sub.score}/{problem.points} Pts)
                            </span>
                          )}
                          {!isPassed && isSubmitted && (
                            <span className="lab-status-badge status-submitted">
                              <Clock size={13} /> Under Review
                            </span>
                          )}
                          {!isPassed && isRevision && (
                            <span className="lab-status-badge status-revision">
                              ⚠️ Revision Needed
                            </span>
                          )}
                          {!sub && isUnlocked && !isExpired && (
                            <span className="lab-status-badge status-active">
                              <Unlock size={13} /> Active Challenge
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="lab-status-badge status-locked">
                              <Lock size={13} /> Locked by Staff
                            </span>
                          )}
                          {isUnlocked && isExpired && (
                            <span className="lab-status-badge status-expired">
                              ⏱️ Closed (Expired)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="lab-desc" style={{ marginBottom: '20px' }}>
                        {problem.description && (
                          <div style={{ marginBottom: problem.starter_code ? '14px' : '0' }}>
                            <RichContentRenderer content={problem.description} />
                          </div>
                        )}

                        {problem.starter_code && (
                          <div style={{
                            background: '#F8FAFC',
                            borderRadius: '14px',
                            border: '1.5px solid #E2E8F0',
                            padding: '16px 18px',
                            marginTop: '12px'
                          }}>
                            <div style={{
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#334155',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <Terminal size={14} color="#7B1C6E" />
                              <span>Code Commands & Starter Implementation:</span>
                            </div>
                            <RichContentRenderer content={problem.starter_code} />
                          </div>
                        )}
                      </div>


                      {/* Footer with Timer and Action Button */}
                      <div className="lab-card-footer">
                        <div>
                          {isUnlocked ? (
                            <CountdownTimer
                              deadline={access.deadline}
                              onExpire={onRefresh}
                            />
                          ) : (
                            <span style={{ fontSize: '13px', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Lock size={14} /> Waiting for instructor to open this lab
                            </span>
                          )}
                        </div>

                        <div>
                          {isUnlocked && (!isExpired || access.allow_late_submission) ? (
                            <button
                              className="btn-primary"
                              onClick={() => setSelectedProblem(problem)}
                              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
                            >
                              <Play size={14} fill="currentColor" />
                              {sub ? 'View / Resubmit Solution' : 'Solve Challenge'}
                            </button>
                          ) : isUnlocked && isExpired ? (
                            <button
                              className="btn-secondary"
                              onClick={() => setSelectedProblem(problem)}
                              style={{ borderRadius: 'var(--radius-full)', padding: '8px 18px' }}
                            >
                              {sub ? 'View Submitted Solution' : 'Deadline Passed'}
                            </button>
                          ) : (
                            <button className="btn-secondary" disabled style={{ opacity: 0.5, cursor: 'not-allowed', borderRadius: 'var(--radius-full)', padding: '8px 18px' }}>
                              <Lock size={13} /> Access Locked
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </section>
          )}

            {/* Bottom Topic Navigation with Completion Checklist */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              marginTop: '50px',
              paddingTop: '24px',
              borderTop: '1px solid var(--border-subtle)',
              flexWrap: 'wrap'
            }}>
              {prevTopic ? (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setActiveTopicId(prevTopic.topic_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ borderRadius: 'var(--radius-full)', padding: '9px 18px', fontSize: '13px' }}
                >
                  <ArrowLeft size={14} /> Previous: {prevTopic.title}
                </button>
              ) : <div />}

              <button
                className="btn-primary"
                onClick={() => {
                  toggleTopicRead(activeTopic.topic_id);
                  if (nextTopic) {
                    setActiveTopicId(nextTopic.topic_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                style={{
                  borderRadius: 'var(--radius-full)',
                  padding: '9px 22px',
                  fontSize: '13px',
                  background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)'
                }}
              >
                <CheckCircle2 size={15} /> Mark Done & Continue to Next Topic
              </button>

              {nextTopic && (
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setActiveTopicId(nextTopic.topic_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ borderRadius: 'var(--radius-full)', padding: '9px 18px', fontSize: '13px' }}
                >
                  Next: {nextTopic.title} <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
            Select a topic from the syllabus sidebar to begin learning.
          </div>
        )}
      </main>



      {/* Problem Workbench Modal */}
      {selectedProblem && (
        <ProblemWorkbenchModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
          onSubmitted={() => {
            setSelectedProblem(null);
            if (onRefresh) onRefresh();
          }}
        />
      )}
    </div>
  );
}
