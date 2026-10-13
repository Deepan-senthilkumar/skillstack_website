import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Lock, Unlock, Clock, ArrowRight, ArrowLeft,
  Copy, Check, Award, Play, Sparkles, BookOpen, Layers, Code,
  Terminal, Search, Filter, Edit3, Save, Zap, X, HelpCircle,
  ExternalLink, RotateCcw, CheckCircle, FileText, Shield, AlertTriangle,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import CountdownTimer from '../components/CountdownTimer';
import ProblemWorkbenchModal from '../components/ProblemWorkbenchModal';
import SecureQuizModal from '../components/SecureQuizModal';
import RichContentRenderer from '../components/RichContentRenderer';
import CertificateModal from '../components/CertificateModal';
import SponsoredTechCard from '../components/SponsoredTechCard';
import TopicDoubtSection from '../components/TopicDoubtSection';
import { api } from '../api';

export default function StudentPortal({ curriculum = [], user, onRefresh, currentSubject, onBackToCourses, onOpenProfile }) {
  const [internalCurriculum, setInternalCurriculum] = useState(curriculum || []);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [secureQuizTopic, setSecureQuizTopic] = useState(null);
  const [topicProgressMap, setTopicProgressMap] = useState({});
  const [mySubmissions, setMySubmissions] = useState([]);
  const [passedProblemIds, setPassedProblemIds] = useState(new Set());
  const [lockedAlertMessage, setLockedAlertMessage] = useState('');
  const [activeTab, setActiveTab] = useState('notes_content'); // 'notes_content' | 'quiz' | 'labs' | 'code' | 'notes'
  const [mobileLessonsOpen, setMobileLessonsOpen] = useState(false);
  const [collapsedModules, setCollapsedModules] = useState({});
  const [mcqPracticeAnswers, setMcqPracticeAnswers] = useState({});

  // Course Enrollment & Certification State
  const [enrollment, setEnrollment] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(null); // null = checking, true = enrolled, false = not enrolled
  const [enrolling, setEnrolling] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  
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

  // Always fetch fresh curriculum directly from the backend
  const refreshCurriculum = async () => {
    try {
      const slug = currentSubject?.slug || 'c-programming';
      const data = await api.getCurriculum(slug);
      if (Array.isArray(data) && data.length > 0) {
        setInternalCurriculum(data);
      }
    } catch (e) {
      console.warn('Direct curriculum fetch error:', e);
    }
  };

  useEffect(() => {
    refreshCurriculum();
  }, [currentSubject?.slug, currentSubject?.id]);

  // Sync with parent curriculum prop if updated
  useEffect(() => {
    if (Array.isArray(curriculum) && curriculum.length > 0) {
      setInternalCurriculum(curriculum);
    }
  }, [curriculum]);

  const activeCurriculum = (internalCurriculum && internalCurriculum.length > 0) ? internalCurriculum : (curriculum || []);

  const toggleModuleCollapse = (moduleId) => {
    setCollapsedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const handleSelectMcqOption = (questionId, optionKey) => {
    setMcqPracticeAnswers(prev => ({
      ...prev,
      [questionId]: {
        selectedOption: optionKey,
        isRevealed: true
      }
    }));
  };

  const handleResetMcqPractice = (questionId) => {
    setMcqPracticeAnswers(prev => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Flatten all topics for easy navigation
  const flatTopics = [];
  activeCurriculum.forEach(module => {
    (module.topics || []).forEach(topic => {
      flatTopics.push({
        ...topic,
        moduleName: module.name,
        moduleId: module.id,
        level: module.level,
      });
    });
  });

  // Fetch student submissions to verify passed practical tasks
  const loadSubmissions = async () => {
    if (!user) return;
    try {
      const res = await api.getMySubmissions();
      const list = Array.isArray(res) ? res : (res?.results || []);
      setMySubmissions(list);
      const passed = new Set();
      list.forEach(sub => {
        if (sub.is_passed || sub.status === 'PASSED') {
          passed.add(sub.problem);
        }
      });
      setPassedProblemIds(passed);
    } catch (e) {
      console.warn('Failed to load student submissions', e);
    }
  };

  // Fetch student topic progress from backend
  const loadTopicProgress = async () => {
    if (!user) return;
    try {
      const data = await api.getMyTopicProgress();
      const map = {};
      const list = Array.isArray(data) ? data : (data?.results || []);
      list.forEach(p => {
        if (p.topic) {
          map[String(p.topic)] = p;
        }
      });
      setTopicProgressMap(map);
    } catch (e) {
      console.warn('Failed to load topic progress records', e);
    }
  };

  const checkEnrollmentStatus = async () => {
    if (!user) {
      setIsEnrolled(false);
      return;
    }
    try {
      const data = await api.getMyEnrollments();
      const list = Array.isArray(data) ? data : (data?.results || []);
      const matched = list.find(e =>
        (currentSubject?.id && String(e.subject) === String(currentSubject.id)) ||
        (currentSubject?.slug && e.subject_slug === currentSubject.slug) ||
        (list.length > 0 && !currentSubject)
      );
      if (matched) {
        setIsEnrolled(true);
        setEnrollment(matched);
      } else {
        setIsEnrolled(false);
        setEnrollment(null);
      }
    } catch (e) {
      console.warn('Failed to verify enrollment:', e);
      // Fallback: don't lock out if network error
      setIsEnrolled(true);
    }
  };

  const handleEnrollNow = async () => {
    if (!user) {
      alert('Please sign in or register to enroll in this course');
      return;
    }
    const targetSubject = currentSubject?.id || currentSubject?.slug || 'c-programming';
    setEnrolling(true);
    try {
      const res = await api.enrollCourse(targetSubject);
      setIsEnrolled(true);
      setEnrollment(res);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || 'Failed to enroll in this course');
    } finally {
      setEnrolling(false);
    }
  };

  useEffect(() => {
    loadTopicProgress();
    loadSubmissions();
    checkEnrollmentStatus();
  }, [user, currentSubject?.id]);

  // Topic Practical Status: Checks if practical exists and if every problem is passed
  const getTopicPracticalStatus = (topic) => {
    const problems = topic?.problems || [];
    if (problems.length === 0) {
      return { hasProblems: false, isPassed: true, total: 0, passedCount: 0 };
    }
    const passedCount = problems.filter(p => passedProblemIds.has(p.id) || p.my_submission?.is_passed || p.my_submission?.status === 'PASSED').length;
    return {
      hasProblems: true,
      isPassed: passedCount === problems.length,
      total: problems.length,
      passedCount
    };
  };

  // Topic Quiz Status: Checks if topic MCQ quiz exists and if passed (>= 50%)
  const getTopicQuizStatus = (topic) => {
    const p = topicProgressMap[String(topic?.id)] || topic?.user_progress;
    const hasQuiz = Array.isArray(topic?.quiz_questions) && topic.quiz_questions.length > 0;
    const isPassed = Boolean(p?.is_completed || p?.last_passed);
    return { hasQuiz, isPassed, progress: p };
  };

  // Strictly completed: MUST finish Mandatory Practical + MCQ Quiz (if present)
  const isTopicStrictlyCompleted = (topic) => {
    if (!topic) return false;
    const prac = getTopicPracticalStatus(topic);
    const quiz = getTopicQuizStatus(topic);
    return prac.isPassed && (quiz.hasQuiz ? quiz.isPassed : true);
  };

  // Sequential Unlock Map:
  // Topic 0 is unlocked.
  // Topic N is unlocked ONLY IF Topic N - 1 is strictly completed!
  const topicUnlockStatus = {};
  let prevIsDone = true;
  flatTopics.forEach((t) => {
    topicUnlockStatus[t.topic_id] = prevIsDone;
    prevIsDone = prevIsDone && isTopicStrictlyCompleted(t);
  });

  // Module completion status
  const isModuleCompleted = (mod) => {
    const topics = mod.topics || [];
    if (topics.length === 0) return false;
    return topics.every(t => isTopicStrictlyCompleted(t));
  };

  // Real-time cooldown countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTopicProgressMap(prev => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k]?.cooldown_seconds_remaining > 0) {
            const rem = next[k].cooldown_seconds_remaining - 1;
            next[k] = {
              ...next[k],
              cooldown_seconds_remaining: rem,
              is_in_cooldown: rem > 0
            };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Set default active topic on initial load (defaults to first unlocked topic)
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

  // Active topic progress data
  const activePracticalStatus = getTopicPracticalStatus(activeTopic);
  const activeQuizStatus = getTopicQuizStatus(activeTopic);
  const isTopicCompleted = isTopicStrictlyCompleted(activeTopic);
  const isTopicInCooldown = Boolean(activeQuizStatus.progress?.is_in_cooldown && activeQuizStatus.progress?.cooldown_seconds_remaining > 0);
  const isActiveTopicUnlocked = activeTopic ? (topicUnlockStatus[activeTopic.topic_id] !== false) : true;

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

  const handleStartTopicAssessment = (topicObj) => {
    setSecureQuizTopic(topicObj);
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
  const filteredCurriculum = activeCurriculum.map(mod => {
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

  const completedCount = flatTopics.filter(t => isTopicStrictlyCompleted(t)).length;
  const progressPct = flatTopics.length > 0 ? Math.round((completedCount / flatTopics.length) * 100) : 0;

  // Render Sidebar Content (Shared between Desktop Sidebar and Mobile Sheet Drawer)
  const renderSidebarContent = (isMobile = false) => (
    <>
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
            onClick={() => {
              if (isMobile) setMobileLessonsOpen(false);
              onBackToCourses();
            }}
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
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--blue-primary)', marginTop: '2px', lineHeight: 1.3 }}>
          {currentSubject?.name || 'C Programming Masterclass'}
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
        filteredCurriculum.map((mod, modIdx) => {
          const modIsCompleted = isModuleCompleted(mod);
          const modTotalTopics = (mod.topics || []).length;
          const modCompletedTopics = (mod.topics || []).filter(t => isTopicStrictlyCompleted(t)).length;
          const isCollapsed = Boolean(collapsedModules[mod.id]);

          return (
            <div key={mod.id} className="module-group" style={{ marginBottom: '10px' }}>
              <div
                className="module-header"
                onClick={() => toggleModuleCollapse(mod.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  gap: '8px',
                  background: isCollapsed ? '#FAFAFA' : '#F8FAFC'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                  <span style={{
                    width: '20px', height: '20px', borderRadius: '6px',
                    background: modIsCompleted ? '#DCFCE7' : 'rgba(123, 28, 110, 0.1)',
                    color: modIsCompleted ? '#166534' : '#7B1C6E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', fontWeight: 800, flexShrink: 0
                  }}>
                    {modIdx + 1}
                  </span>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{
                      fontWeight: 700, fontSize: '12.5px', color: '#0F172A',
                      lineHeight: 1.35, wordBreak: 'break-word'
                    }}>
                      {mod.name}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {modIsCompleted ? (
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 6px',
                      borderRadius: '12px',
                      background: 'rgba(22, 163, 74, 0.12)',
                      color: '#166534',
                      fontWeight: 800
                    }}>
                      ✓ Done
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>
                      {modCompletedTopics}/{modTotalTopics}
                    </span>
                  )}
                  <span style={{ fontSize: '10px', color: '#94A3B8', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    ▼
                  </span>
                </div>
              </div>

              {!isCollapsed && (
                <div style={{ padding: '4px 0' }}>
                  {mod.filteredTopics.map(topic => {
                    const isActive = topic.topic_id === activeTopicId;
                    const isUnlocked = topicUnlockStatus[topic.topic_id] !== false;
                    const isDone = isTopicStrictlyCompleted(topic);
                    const pracStatus = getTopicPracticalStatus(topic);
                    const quizStatus = getTopicQuizStatus(topic);
                    const p = quizStatus.progress;
                    const inCooldown = Boolean(p?.is_in_cooldown && p?.cooldown_seconds_remaining > 0);

                    return (
                      <div
                        key={topic.id}
                        className={`topic-row ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked-topic' : ''}`}
                        onClick={() => {
                          if (!isUnlocked) {
                            setLockedAlertMessage(`🔒 Lesson Locked: Complete the mandatory practical in previous lessons to unlock "${topic.title}".`);
                            setTimeout(() => setLockedAlertMessage(''), 4500);
                            return;
                          }
                          setActiveTopicId(topic.topic_id);
                          if (isMobile) setMobileLessonsOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          opacity: isUnlocked ? 1 : 0.6,
                          background: isActive ? 'rgba(123, 28, 110, 0.08)' : 'transparent',
                          borderLeft: isActive ? '3px solid #7B1C6E' : '3px solid transparent',
                          margin: '2px 4px',
                          transition: 'all 0.15s ease'
                        }}
                        title={!isUnlocked ? 'Locked: Finish previous lesson mandatory practical' : topic.title}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                          <span style={{
                            width: '18px', height: '18px', borderRadius: '5px',
                            border: `1.5px solid ${!isUnlocked ? '#CBD5E1' : isDone ? '#16A34A' : inCooldown ? '#D97706' : '#94A3B8'}`,
                            background: !isUnlocked ? '#F1F5F9' : isDone ? '#16A34A' : inCooldown ? '#FEF3C7' : '#FFFFFF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, fontSize: '10px', color: !isUnlocked ? '#94A3B8' : isDone ? '#FFFFFF' : '#D97706', fontWeight: 800
                          }}>
                            {!isUnlocked ? '🔒' : isDone ? '✓' : inCooldown ? '⏳' : '📖'}
                          </span>
                          <span style={{
                            fontSize: '12.5px',
                            fontWeight: isActive ? 700 : 500,
                            color: !isUnlocked ? '#94A3B8' : isActive ? '#7B1C6E' : '#1E293B',
                            lineHeight: 1.35,
                            wordBreak: 'break-word'
                          }}>
                            {topic.title}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          {inCooldown && (
                            <span style={{
                              fontSize: '9px',
                              background: 'rgba(217, 119, 6, 0.1)',
                              color: '#D97706',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              fontFamily: 'monospace'
                            }}>
                              {Math.floor(p.cooldown_seconds_remaining / 60)}m
                            </span>
                          )}

                          {isUnlocked && pracStatus.hasProblems && !pracStatus.isPassed && (
                            <span style={{
                              fontSize: '9px',
                              background: 'rgba(217, 119, 6, 0.12)',
                              color: '#B45309',
                              border: '1px solid rgba(217, 119, 6, 0.35)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 800,
                              flexShrink: 0
                            }}>
                              ⚡ LAB
                            </span>
                          )}

                          {isUnlocked && isDone && (
                            <span style={{
                              fontSize: '9px',
                              color: '#16A34A',
                              fontWeight: 800
                            }}>
                              PASSED
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
      <SponsoredTechCard variant="sidebar" />
    </>
  );

  if (isEnrolled === false) {
    return (
      <div style={{
        maxWidth: '860px',
        margin: '50px auto 90px',
        padding: '0 20px',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px solid #E2E8F0',
          padding: '48px 36px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.06)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Top Accent */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #7B1C6E 0%, #FDC029 100%)'
          }} />

          <div style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'rgba(123, 28, 110, 0.08)',
            color: '#7B1C6E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            border: '1.5px solid rgba(123, 28, 110, 0.15)'
          }}>
            <Lock size={36} />
          </div>

          <div style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '11.5px',
            fontWeight: 800,
            letterSpacing: '0.05em',
            background: '#FEF3C7',
            color: '#B45309',
            marginBottom: '12px'
          }}>
            ENROLLMENT REQUIRED
          </div>

          <h2 style={{
            fontSize: '28px',
            fontWeight: 850,
            color: '#0F172A',
            marginBottom: '10px',
            letterSpacing: '-0.02em'
          }}>
            Registration Required: {currentSubject?.name || 'Academic Track'}
          </h2>

          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            maxWidth: '580px',
            margin: '0 auto 28px',
            lineHeight: 1.6
          }}>
            This interactive learning workbench is restricted to enrolled students.
            Registering is 100% free and gives you immediate access to structured lesson theory, topic MCQs, and automated compiler laboratories.
          </p>

          {/* Course Summary Box */}
          <div style={{
            maxWidth: '520px',
            margin: '0 auto 32px',
            background: '#F8FAFC',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Curriculum</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>{flatTopics.length} Lessons</div>
            </div>
            <div style={{ width: '1px', background: '#CBD5E1' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Level</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#7B1C6E' }}>{currentSubject?.level || 'Intermediate'}</div>
            </div>
            <div style={{ width: '1px', background: '#CBD5E1' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Tuition</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#10B981' }}>100% Free Pro</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleEnrollNow}
              disabled={enrolling}
              style={{
                padding: '14px 28px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(123, 28, 110, 0.3)',
                opacity: enrolling ? 0.7 : 1
              }}
            >
              {enrolling ? 'Enrolling...' : <>🚀 Enroll in this Track Free</>}
            </button>

            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                style={{
                  padding: '14px 24px',
                  borderRadius: '999px',
                  background: '#F1F5F9',
                  color: '#334155',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Award size={16} /> My Enrolled Courses
              </button>
            )}

            {onBackToCourses && (
              <button
                onClick={onBackToCourses}
                style={{
                  padding: '14px 24px',
                  borderRadius: '999px',
                  background: '#FFFFFF',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
              >
                Browse Catalog
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (flatTopics.length === 0 || !activeTopic) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E2E8F0', padding: '48px 32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌱</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>Clean Slate Ready!</h2>
          <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6, maxWidth: '500px', margin: '0 auto 24px' }}>
            All course and curriculum data has been cleared as requested. You can now start creating your new subjects, chapters, topics, coding labs, and MCQs from scratch in the Admin Panel!
          </p>
          {onBackToCourses && (
            <button
              className="btn-primary"
              onClick={onBackToCourses}
              style={{
                borderRadius: '999px',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ArrowLeft size={16} /> Back to Courses
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* =========================================================================
          DESKTOP SIDEBAR NAVIGATION (Hidden on mobile)
          ========================================================================= */}
      <aside className="app-sidebar desktop-sidebar" style={{ background: '#FFFFFF' }}>
        {renderSidebarContent(false)}
      </aside>

      {/* =========================================================================
          MOBILE LESSONS SLIDE-OVER SHEET DRAWER
          ========================================================================= */}
      {mobileLessonsOpen && (
        <div
          className="mobile-sheet-overlay"
          onClick={() => setMobileLessonsOpen(false)}
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
            className="mobile-sheet-drawer left-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '88%',
              maxWidth: '360px',
              background: '#FFFFFF',
              zIndex: 1101,
              boxShadow: '10px 0 30px rgba(0, 0, 0, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="#7B1C6E" />
                <span style={{ fontWeight: 800, fontSize: '15px', color: '#0F172A' }}>
                  Course Syllabus ({flatTopics.length})
                </span>
              </div>
              <button
                onClick={() => setMobileLessonsOpen(false)}
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

            {/* Scrollable Curriculum in Drawer */}
            <div style={{ padding: '14px 16px', overflowY: 'auto', flex: 1 }}>
              {renderSidebarContent(true)}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN LESSON & LABS WORKBENCH
          ========================================================================= */}
      <main className="app-main" style={{ background: '#F8FAFC' }}>
        {/* Mobile Sticky Lessons Bar */}
        <div className="mobile-lessons-topbar">
          <button
            onClick={() => setMobileLessonsOpen(true)}
            className="mobile-browse-lessons-btn"
          >
            <BookOpen size={14} /> Browse Lessons ({flatTopics.length})
          </button>

          <div className="mobile-topic-indicator">
            <span className="mobile-topic-pill">#{activeIdx + 1}/{flatTopics.length}</span>
            <span className="mobile-topic-name">{activeTopic?.title}</span>
          </div>

          <div className="mobile-prev-next-nav">
            {prevTopic && (
              <button
                onClick={() => { setActiveTopicId(prevTopic.topic_id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="mobile-nav-arrow-btn"
                title="Previous Lesson"
              >
                <ArrowLeft size={13} />
              </button>
            )}
            {nextTopic && (
              <button
                onClick={() => { setActiveTopicId(nextTopic.topic_id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="mobile-nav-arrow-btn"
                title="Next Lesson"
              >
                <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>
        {/* Floating / Top Alert for Locked Lesson Clicks */}
        {lockedAlertMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            border: '1.5px solid #F87171',
            borderRadius: '16px',
            padding: '12px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(220, 38, 38, 0.1)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#991B1B', fontWeight: 700 }}>
              <Lock size={16} color="#DC2626" />
              <span>{lockedAlertMessage}</span>
            </div>
            <button
              onClick={() => setLockedAlertMessage('')}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#991B1B' }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        {(enrollment?.status === 'COMPLETED' || (flatTopics.length > 0 && flatTopics.every(t => isTopicStrictlyCompleted(t)))) && (
          <div style={{
            background: 'linear-gradient(135deg, #FAF5FF 0%, #FDF4FF 100%)',
            border: '2px solid #C084FC',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            boxShadow: '0 8px 24px rgba(192, 132, 252, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7B1C6E 0%, #FDC029 100%)',
                color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Award size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#581C87' }}>
                  🎓 100% Curriculum Mastery Verified!
                </div>
                <div style={{ fontSize: '12px', color: '#7E22CE' }}>
                  You have successfully passed all theory lessons, MCQs, and mandatory compiler laboratory challenges.
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCertModal(true)}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #7E22CE 0%, #A855F7 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)'
              }}
            >
              <Award size={16} /> View &amp; Print Certificate 🎓
            </button>
          </div>
        )}

        {activeTopic ? (
          <div>
            {/* Topic Hero Header with Badges */}
            <div className="topic-hero" style={{
              background: '#FFFFFF',
              border: '1.5px solid rgba(123, 28, 110, 0.14)',
              borderRadius: '24px',
              padding: '28px 32px',
              boxShadow: '0 10px 30px rgba(0, 60, 160, 0.05)',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', flexWrap: 'wrap' }}>
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

                  {isTopicCompleted ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          border: '1.5px solid #16A34A',
                          color: '#166534',
                          background: 'rgba(22, 163, 74, 0.1)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 size={14} color="#16A34A" /> Passed &amp; Completed
                      </span>
                    </div>
                  ) : activePracticalStatus.hasProblems && !activePracticalStatus.isPassed ? (
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1.5px solid #D97706',
                        color: '#92400E',
                        background: '#FEF3C7',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Terminal size={13} />
                      <span>Practical Required ({activePracticalStatus.passedCount}/{activePracticalStatus.total})</span>
                    </div>
                  ) : isTopicInCooldown ? (
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        border: '1.5px solid #F59E0B',
                        color: '#92400E',
                        background: '#FEF3C7',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'monospace'
                      }}
                    >
                      <Clock size={13} />
                      <span>Cooldown: {Math.floor(activeQuizStatus.progress?.cooldown_seconds_remaining / 60)}m</span>
                    </div>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => handleStartTopicAssessment(activeTopic)}
                      style={{
                        fontSize: '12px',
                        fontWeight: 800,
                        padding: '7px 16px',
                        borderRadius: 'var(--radius-full)',
                        background: 'linear-gradient(135deg, #7B1C6E 0%, #4338CA 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(123, 28, 110, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Shield size={13} />
                      <span>Take 5-Q Test</span>
                    </button>
                  )}
                </div>
              </div>

              <h1 className="topic-title" style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', margin: '4px 0 8px' }}>
                {activeTopic.title}
              </h1>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Explore theory notes, verified code implementations, and interactive practical evaluation sandboxes.
              </p>
            </div>

            {/* Mandatory Topic Progression Stepper (Interactive Clickable Step Pills) */}
            <div className="stepper-nav-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Step 1: Theory */}
                <button
                  type="button"
                  onClick={() => setActiveTab('notes_content')}
                  className={`stepper-step-pill ${activeTab === 'notes_content' ? 'active' : ''}`}
                  style={{ color: '#166534' }}
                >
                  <CheckCircle2 size={16} color="#16A34A" />
                  <span>1. Theory &amp; Notes</span>
                </button>

                <span style={{ color: '#CBD5E1', fontSize: '13px' }}>→</span>

                {/* Step 2: Topic MCQs */}
                <button
                  type="button"
                  onClick={() => setActiveTab('quiz')}
                  className={`stepper-step-pill ${activeTab === 'quiz' ? 'active' : ''}`}
                  style={{
                    color: activeQuizStatus.isPassed ? '#166534' : activeTab === 'quiz' ? '#7B1C6E' : '#475569'
                  }}
                >
                  {activeQuizStatus.isPassed ? (
                    <CheckCircle2 size={16} color="#16A34A" />
                  ) : (
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      border: activeTab === 'quiz' ? '2px solid #7B1C6E' : '2px solid #CBD5E1',
                      background: activeTab === 'quiz' ? '#7B1C6E' : '#FFFFFF',
                      color: activeTab === 'quiz' ? '#FFFFFF' : '#64748B',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10.5px', fontWeight: 800
                    }}>2</span>
                  )}
                  <span>2. Topic MCQs {activeQuizStatus.isPassed ? '(Passed)' : `(${activeTopic?.quiz_questions?.length || 3} Qs)`}</span>
                </button>

                <span style={{ color: '#CBD5E1', fontSize: '13px' }}>→</span>

                {/* Step 3: Mandatory Practical */}
                <button
                  type="button"
                  onClick={() => setActiveTab('labs')}
                  className={`stepper-step-pill ${activeTab === 'labs' ? 'active' : ''}`}
                  style={{
                    color: activePracticalStatus.isPassed ? '#166534' : '#D97706'
                  }}
                >
                  {activePracticalStatus.isPassed ? (
                    <CheckCircle2 size={16} color="#16A34A" />
                  ) : (
                    <span style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: '#FEF3C7', color: '#D97706', border: '1.5px solid #D97706',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 800
                    }}>⚡</span>
                  )}
                  <span>3. Mandatory Practical {activePracticalStatus.isPassed ? '(Passed)' : `(${activePracticalStatus.passedCount}/${activePracticalStatus.total})`}</span>
                </button>
              </div>

              {/* Stepper Right Quick Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!activeQuizStatus.isPassed && (
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('quiz')}
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      color: '#7B1C6E',
                      borderColor: 'rgba(123, 28, 110, 0.25)',
                      background: 'rgba(123, 28, 110, 0.04)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <HelpCircle size={13} /> Practice MCQs
                  </button>
                )}

                {!activePracticalStatus.isPassed ? (
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab('labs')}
                    style={{
                      background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                    }}
                  >
                    <Terminal size={13} /> Mandatory Practical Lab
                  </button>
                ) : nextTopic && topicUnlockStatus[nextTopic.topic_id] ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setActiveTopicId(nextTopic.topic_id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
                    }}
                  >
                    <span>Next Lesson Unlocked →</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} color="#16A34A" /> Lesson Fully Mastered!
                  </span>
                )}
              </div>
            </div>

            {/* Content Tabs */}
            <div className="content-tabs">
              <button
                className={`content-tab-btn ${activeTab === 'notes_content' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes_content')}
              >
                <BookOpen size={14} color={activeTab === 'notes_content' ? '#FFFFFF' : '#7B1C6E'} />
                <span>Theory &amp; Notes</span>
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <HelpCircle size={14} color={activeTab === 'quiz' ? '#FFFFFF' : '#D97706'} />
                <span>
                  Topic MCQs &amp; Quiz ({activeTopic.quiz_questions?.length || 3})
                  {activeQuizStatus.isPassed && ' ✓'}
                </span>
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'labs' ? 'active' : ''}`}
                onClick={() => setActiveTab('labs')}
              >
                <Layers size={14} color={activeTab === 'labs' ? '#FFFFFF' : '#16A34A'} />
                <span>
                  Mandatory Practical Labs ({activePracticalStatus.passedCount}/{activePracticalStatus.total})
                  {activePracticalStatus.isPassed && ' ✓'}
                </span>
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
              >
                <Code size={14} color={activeTab === 'code' ? '#FFFFFF' : '#2563EB'} />
                <span>Practical Code ({activeTopic.examples?.length || 0})</span>
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                onClick={() => setActiveTab('notes')}
              >
                <Edit3 size={14} color={activeTab === 'notes' ? '#FFFFFF' : '#8B5CF6'} />
                <span>My Notes</span>
              </button>

              <button
                className={`content-tab-btn ${activeTab === 'doubts' ? 'active' : ''}`}
                onClick={() => setActiveTab('doubts')}
                style={{
                  background: activeTab === 'doubts' ? 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)' : undefined,
                  color: activeTab === 'doubts' ? '#FFFFFF' : '#7B1C6E',
                  fontWeight: 800
                }}
              >
                <MessageSquare size={14} color={activeTab === 'doubts' ? '#FFFFFF' : '#7B1C6E'} />
                <span>Ask Doubt &amp; Clarification</span>
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
                {/* Core Architecture & Concept Highlights (from topic.explain) */}
                {Array.isArray(activeTopic.explain) && activeTopic.explain.length > 0 && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(123, 28, 110, 0.04) 0%, rgba(253, 192, 41, 0.06) 100%)',
                    border: '1.5px solid rgba(123, 28, 110, 0.16)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '26px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: '#7B1C6E',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <Sparkles size={16} color="#7B1C6E" />
                      <span>Core Architecture &amp; Key Concepts</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {activeTopic.explain.map((item, idx) => (
                        <li key={idx} style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.6 }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Visual Architecture & Topic Concept Diagram (from topic.images) */}
                {Array.isArray(activeTopic.images) && activeTopic.images.length > 0 && activeTopic.images[0]?.image_url && (
                  <div style={{
                    marginBottom: '24px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(123, 28, 110, 0.14)',
                    background: '#0F172A',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                  }}>
                    <img
                      src={activeTopic.images[0].image_url}
                      alt={activeTopic.images[0].caption || activeTopic.title}
                      style={{
                        width: '100%',
                        maxHeight: '340px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    {activeTopic.images[0].caption && (
                      <div style={{
                        padding: '10px 16px',
                        background: '#1E293B',
                        color: '#E2E8F0',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <Sparkles size={13} color="#FDC029" />
                        <span>Architecture Diagram: {activeTopic.images[0].caption}</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTopic.notes_content && activeTopic.notes_content.trim() ? (
                  <RichContentRenderer content={activeTopic.notes_content} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                    <div style={{ fontSize: '36px', marginBottom: '12px' }}>📝</div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: '#64748B' }}>No study notes added yet for this topic.</div>
                    <div style={{ fontSize: '12.5px', marginTop: '6px' }}>Notes added in Django Admin will appear here dynamically.</div>
                  </div>
                )}

                {/* Non-Intrusive Sponsored / Partner Resource Card */}
                <SponsoredTechCard variant="banner" />

                {/* 1-on-1 Trainer Doubt Clarification Card */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 22px', background: 'linear-gradient(135deg, #FAF5FF 0%, #F5F3FF 100%)',
                  borderRadius: '16px', border: '1.5px solid rgba(123, 28, 110, 0.16)',
                  marginTop: '20px', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                    }}>
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                        Have any doubts on this topic?
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Submit your question to Prof. Deepan and receive a private 1-on-1 clarification message.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('doubts')}
                    style={{
                      background: '#FFFFFF', color: '#7B1C6E', border: '1.5px solid #7B1C6E',
                      padding: '8px 18px', borderRadius: '999px', fontSize: '12px', fontWeight: 800,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    <span>Ask Doubt / Clarification 💬</span>
                  </button>
                </div>

                {/* Transition to Step 2 */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '18px 24px', background: 'rgba(123, 28, 110, 0.04)',
                  borderRadius: '16px', border: '1.5px solid rgba(123, 28, 110, 0.12)',
                  marginTop: '28px', flexWrap: 'wrap', gap: '12px'
                }}>
                  <div>
                    <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A' }}>Finished reading the core concepts?</div>
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>Next: Step 2 &bull; Practice Topic MCQs and verify your understanding.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)',
                      color: '#FFFFFF', border: 'none', padding: '9px 20px',
                      borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 800,
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 4px 14px rgba(123, 28, 110, 0.25)'
                    }}
                  >
                    <span>Next: Practice Topic MCQs →</span>
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                TAB: Topic MCQs & Quiz Self-Assessment
                ========================================================================= */}
            {activeTab === 'quiz' && (
              <div className="mcq-container">
                {/* Header Card */}
                <div style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 100%)',
                  border: '1.5px solid rgba(123, 28, 110, 0.16)',
                  borderRadius: '20px',
                  padding: '24px 28px',
                  boxShadow: '0 4px 16px rgba(123, 28, 110, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-full)',
                        background: 'rgba(123, 28, 110, 0.1)', color: '#7B1C6E', textTransform: 'uppercase'
                      }}>
                        Knowledge Gate &bull; Step 2
                      </span>
                      {activeQuizStatus.isPassed ? (
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(22, 163, 74, 0.1)', color: '#166534', border: '1px solid #16A34A' }}>
                          ✓ Passed &amp; Verified
                        </span>
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: '#FEF3C7', color: '#92400E' }}>
                          Self-Practice &amp; Scored Test
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                      Topic Multiple Choice Questions ({activeTopic.quiz_questions?.length || 3})
                    </h2>
                    <p style={{ fontSize: '13.5px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                      Practice the core conceptual questions below. Select an answer to get instant explanations.
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      className="btn-primary"
                      onClick={() => handleStartTopicAssessment(activeTopic)}
                      style={{
                        background: 'linear-gradient(135deg, #7B1C6E 0%, #4338CA 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(123, 28, 110, 0.3)'
                      }}
                    >
                      <Shield size={15} />
                      <span>{activeQuizStatus.isPassed ? 'Re-take 5-Q Test' : 'Take Scored 5-Q Test'}</span>
                    </button>
                  </div>
                </div>

                {/* Question Cards List */}
                {(!activeTopic.quiz_questions || activeTopic.quiz_questions.length === 0) ? (
                  <div style={{
                    padding: '48px 24px', textAlign: 'center', background: '#FFFFFF',
                    borderRadius: '20px', border: '1.5px dashed #CBD5E1', color: '#64748B'
                  }}>
                    <HelpCircle size={36} color="#94A3B8" style={{ marginBottom: '12px' }} />
                    <div style={{ fontWeight: 800, fontSize: '16px', color: '#1E293B' }}>Loading Topic Questions...</div>
                    <div style={{ fontSize: '13px', marginTop: '6px' }}>
                      Questions are automatically synchronized with the backend question bank.
                    </div>
                  </div>
                ) : (
                  activeTopic.quiz_questions.map((q, qIdx) => {
                    const practiceState = mcqPracticeAnswers[q.id];
                    const selectedOpt = practiceState?.selectedOption;
                    const isRevealed = Boolean(practiceState?.isRevealed);
                    const isCorrect = selectedOpt === q.correct_option;

                    const optionsList = [
                      { key: 'A', text: q.option_a },
                      { key: 'B', text: q.option_b },
                      { key: 'C', text: q.option_c },
                      { key: 'D', text: q.option_d },
                    ].filter(opt => Boolean(opt.text));

                    return (
                      <div key={q.id || qIdx} className="mcq-card">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: 800, padding: '3px 10px',
                            borderRadius: 'var(--radius-full)', background: '#F1F5F9', color: '#475569', textTransform: 'uppercase'
                          }}>
                            Question #{qIdx + 1}
                          </span>
                          {isRevealed && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontSize: '12px', fontWeight: 800,
                                color: isCorrect ? '#16A34A' : '#DC2626',
                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}>
                                {isCorrect ? <CheckCircle2 size={14} /> : <X size={14} />}
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleResetMcqPractice(q.id)}
                                style={{
                                  background: 'transparent', border: 'none', color: '#64748B',
                                  fontSize: '11.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px'
                                }}
                              >
                                <RotateCcw size={12} /> Retry
                              </button>
                            </div>
                          )}
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', lineHeight: 1.5, margin: '0 0 16px' }}>
                          {q.question_text}
                        </h3>

                        {/* Options Grid */}
                        <div className="mcq-options-grid">
                          {optionsList.map(opt => {
                            const isThisSelected = selectedOpt === opt.key;
                            const isThisCorrectAnswer = q.correct_option === opt.key;

                            let btnClass = 'mcq-option-btn';
                            if (isRevealed) {
                              if (isThisSelected) {
                                btnClass += isCorrect ? ' selected-correct' : ' selected-wrong';
                              } else if (isThisCorrectAnswer) {
                                btnClass += ' highlight-correct';
                              }
                            }

                            return (
                              <button
                                key={opt.key}
                                type="button"
                                className={btnClass}
                                onClick={() => handleSelectMcqOption(q.id, opt.key)}
                              >
                                <span className="mcq-option-circle">{opt.key}</span>
                                <span style={{ flex: 1 }}>{opt.text}</span>
                                {isRevealed && isThisCorrectAnswer && (
                                  <Check size={16} color="#16A34A" />
                                )}
                                {isRevealed && isThisSelected && !isCorrect && (
                                  <X size={16} color="#DC2626" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        {isRevealed && q.explanation && (
                          <div className={`mcq-explanation-box ${isCorrect ? 'correct' : 'wrong'}`}>
                            <strong>💡 Concept Explanation:</strong>
                            <div style={{ marginTop: '4px' }}>{q.explanation}</div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Bottom Stepper Transition */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '20px 24px', background: '#FFFFFF', borderRadius: '16px',
                  border: '1px solid #E2E8F0', marginTop: '12px', flexWrap: 'wrap', gap: '12px'
                }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('notes_content')}
                    className="btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 18px', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <ArrowLeft size={14} /> Back to Theory &amp; Notes
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('labs')}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
                      color: '#FFFFFF', border: 'none', fontSize: '13px', fontWeight: 800,
                      padding: '9px 22px', borderRadius: 'var(--radius-full)',
                      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px',
                      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.25)'
                    }}
                  >
                    <span>Proceed to Step 3: Mandatory Practical Lab →</span>
                  </button>
                </div>
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
                TAB: 1-on-1 Topic Doubts & Trainer Clarification Messenger
                ========================================================================= */}
            {activeTab === 'doubts' && (
              <TopicDoubtSection topic={activeTopic} currentUser={user} />
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

            {/* freeCodeCamp-Style Step-by-Step Bottom Navigation */}
            <div className="fcc-bottom-nav">
              {prevTopic ? (
                <button
                  className="fcc-nav-btn prev"
                  onClick={() => {
                    setActiveTopicId(prevTopic.topic_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  title={`Previous: ${prevTopic.title}`}
                >
                  <ArrowLeft size={14} />
                  <span>Prev Lesson</span>
                </button>
              ) : <div />}

              {isTopicCompleted ? (
                <button
                  className="fcc-nav-btn next"
                  onClick={() => {
                    if (nextTopic && topicUnlockStatus[nextTopic.topic_id] !== false) {
                      setActiveTopicId(nextTopic.topic_id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  style={{ background: 'linear-gradient(135deg, #16A34A 0%, #059669 100%)' }}
                >
                  <CheckCircle2 size={15} />
                  <span>Topic Completed &bull; Next Lesson</span>
                  <ArrowRight size={14} />
                </button>
              ) : activePracticalStatus.hasProblems && !activePracticalStatus.isPassed ? (
                <button
                  className="fcc-nav-btn action"
                  onClick={() => setActiveTab('labs')}
                  style={{
                    backgroundColor: '#FEF3C7',
                    borderColor: '#D97706',
                    color: '#92400E',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  <Terminal size={15} />
                  <span>Mandatory Practical Required ({activePracticalStatus.passedCount}/{activePracticalStatus.total})</span>
                </button>
              ) : isTopicInCooldown ? (
                <button
                  className="fcc-nav-btn action"
                  disabled
                  style={{
                    backgroundColor: '#FEF3C7',
                    borderColor: '#F59E0B',
                    color: '#92400E',
                    cursor: 'not-allowed',
                    fontFamily: 'monospace'
                  }}
                >
                  <Clock size={15} />
                  <span>Cooldown: {Math.floor(activeQuizStatus.progress?.cooldown_seconds_remaining / 60)}m</span>
                </button>
              ) : (
                <button
                  className="fcc-nav-btn next"
                  onClick={() => handleStartTopicAssessment(activeTopic)}
                >
                  <Shield size={15} />
                  <span>Take 5-Q Test</span>
                </button>
              )}

              {nextTopic && (
                <button
                  className="fcc-nav-btn prev"
                  onClick={() => {
                    const isNextUnlocked = topicUnlockStatus[nextTopic.topic_id] !== false;
                    if (!isNextUnlocked) {
                      setLockedAlertMessage(`🔒 Next Lesson Locked: Complete this topic's mandatory practical lab to unlock "${nextTopic.title}".`);
                      setTimeout(() => setLockedAlertMessage(''), 4500);
                      return;
                    }
                    setActiveTopicId(nextTopic.topic_id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    opacity: topicUnlockStatus[nextTopic.topic_id] === false ? 0.6 : 1,
                    cursor: topicUnlockStatus[nextTopic.topic_id] === false ? 'not-allowed' : 'pointer'
                  }}
                  title={topicUnlockStatus[nextTopic.topic_id] === false ? 'Locked: Finish mandatory practical first' : `Next: ${nextTopic.title}`}
                >
                  {topicUnlockStatus[nextTopic.topic_id] === false ? <Lock size={13} color="#94A3B8" /> : null}
                  <span>Next Lesson</span>
                  <ArrowRight size={14} />
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
          onSubmitted={(res) => {
            setSelectedProblem(null);
            loadSubmissions();
            loadTopicProgress();
            if (onRefresh) onRefresh();
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          }}
        />
      )}

      {/* Secure Topic Quiz Assessment Modal */}
      {secureQuizTopic && (
        <SecureQuizModal
          topic={secureQuizTopic}
          onClose={() => setSecureQuizTopic(null)}
          onPassed={(res) => {
            setTopicProgressMap(prev => ({
              ...prev,
              [String(secureQuizTopic.id)]: {
                is_completed: true,
                attempts_count: (prev[String(secureQuizTopic.id)]?.attempts_count || 0) + 1,
                last_score: res.score,
                last_percentage: res.percentage,
                is_in_cooldown: false,
                cooldown_seconds_remaining: 0
              }
            }));
            const updated = { ...readTopics, [secureQuizTopic.topic_id]: true };
            setReadTopics(updated);
            localStorage.setItem('kalari_read_topics', JSON.stringify(updated));
            loadTopicProgress();
            if (onRefresh) onRefresh();
          }}
        />
      )}

      {/* High-Resolution Printable Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          certificate={enrollment?.certificate_details || {
            certificate_id: `CERT-SKILLSTACK-${(currentSubject?.slug || 'C-PROGRAMMING').toUpperCase()}-${currentSubject?.id || 1}`,
            student_name: user?.first_name || user?.username || 'Fellow Student',
            course_name: currentSubject?.name || 'Systems Engineering with C Programming',
            grade_percentage: 100,
            issued_at: new Date().toISOString()
          }}
          onClose={() => setShowCertModal(false)}
        />
      )}
    </div>
  );
}
