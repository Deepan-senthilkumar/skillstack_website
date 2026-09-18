import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudentPortal from './pages/StudentPortal';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import { api } from './api';

// ADMIN PANEL URL — update this to your deployed admin Vercel URL
const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export default function App() {
  const [user, setUser] = useState(api.getUser());
  const [currentPage, setCurrentPage] = useState('home');
  // 'home' | 'courses' | 'course-detail' | 'about' | 'contact' | 'learning'
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [capabilities, setCapabilities] = useState([]);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('student');
  const [authModalRegister, setAuthModalRegister] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState(null);

  const [isServerWaking, setIsServerWaking] = useState(false);

  // Fetch all active subjects
  const fetchSubjects = async () => {
    const wakingTimer = setTimeout(() => setIsServerWaking(true), 2500);
    try {
      const data = await api.getSubjects();
      clearTimeout(wakingTimer);
      setIsServerWaking(false);
      setSubjects(data);
      if (data.length > 0 && !selectedSubject) {
        const djangoSub = data.find(s => s.slug === 'django-fullstack') || data[0];
        setSelectedSubject(djangoSub);
      }
    } catch (err) {
      clearTimeout(wakingTimer);
      setIsServerWaking(false);
      console.error('Error fetching subjects', err);
    }
  };

  const fetchCurriculum = async (subjectSlug) => {
    setLoadingCurriculum(true);
    try {
      const slug = subjectSlug || (selectedSubject ? selectedSubject.slug : '');
      if (slug) {
        const data = await api.getCurriculum(slug);
        setCurriculum(data);
      }
    } catch (err) {
      console.error('Error fetching curriculum', err);
    } finally {
      setLoadingCurriculum(false);
    }
  };

  const checkUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
      api.setUser(me);
    } catch {
      api.clearTokens();
      setUser(null);
    }
  };

  useEffect(() => {
    fetchSubjects();
    if (api.getToken()) checkUser();

    // Fetch dynamic website content
    api.getCapabilities().then(data => {
      if (data && data.length > 0) setCapabilities(data);
    });

    const handleLogoutEvent = () => {
      setUser(null);
      setCurrentPage('home');
    };
    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  // Only load detailed curriculum when user actually visits the curriculum, course detail or learning page
  useEffect(() => {
    if (selectedSubject && ['curriculum', 'course-detail', 'learning'].includes(currentPage)) {
      fetchCurriculum(selectedSubject.slug);
    }
  }, [selectedSubject, currentPage]);

  const handleLogout = () => {
    api.clearTokens();
    setUser(null);
    setCurrentPage('home');
  };

  const handleOpenAuth = (tab = 'student', isRegister = false, callback = null) => {
    setAuthModalTab(tab);
    setAuthModalRegister(isRegister);
    setPostAuthCallback(() => callback);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setAuthModalOpen(false);

    // If staff/admin logs in via website, redirect them to admin panel
    if (authenticatedUser.is_instructor || authenticatedUser.is_admin_role) {
      api.clearTokens(); // Don't keep admin session in website
      alert(`Welcome ${authenticatedUser.first_name || authenticatedUser.username}! Redirecting you to the Admin Panel...`);
      window.open(ADMIN_PANEL_URL, '_blank');
      return;
    }

    if (postAuthCallback && typeof postAuthCallback === 'function') {
      postAuthCallback(authenticatedUser);
      setPostAuthCallback(null);
    } else if (currentPage === 'home') {
      setCurrentPage('learning');
    }
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = (subject) => {
    if (subject) {
      setSelectedSubject(subject);
      fetchCurriculum(subject.slug);
    }
    if (!user) {
      handleOpenAuth('student', false, () => {
        setCurrentPage('learning');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      setCurrentPage('learning');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Progress stats
  let totalTopics = 0;
  let completedTopics = 0;
  try {
    const saved = localStorage.getItem('kalari_read_topics');
    const read = saved ? JSON.parse(saved) : {};
    curriculum.forEach(m => {
      (m.topics || []).forEach(t => {
        totalTopics++;
        if (read[t.topic_id]) completedTopics++;
      });
    });
  } catch {}

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {isServerWaking && (
        <div style={{
          position: 'fixed',
          top: '14px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'linear-gradient(135deg, #7B1C6E 0%, #A82596 100%)',
          color: '#FFFFFF',
          padding: '8px 18px',
          borderRadius: '999px',
          boxShadow: '0 8px 24px rgba(123, 28, 110, 0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '12.5px',
          fontWeight: 600,
          pointerEvents: 'none'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#FDC029' }} />
          ⚡ Server is waking up from standby (Render free tier)... Please wait a moment.
        </div>
      )}
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={(tab, isReg) => handleOpenAuth(tab, isReg)}
        onLogout={handleLogout}
        progressStats={{ total: totalTopics, completed: completedTopics }}
        adminPanelUrl={ADMIN_PANEL_URL}
      />

      <main>
        {currentPage === 'home' && (
          <HomePage
            subjects={subjects}
            capabilities={capabilities}
            onSelectSubject={handleSelectSubject}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStudentAuth={(isReg) => handleOpenAuth('student', isReg)}
            onOpenStaffAuth={() => handleOpenAuth('staff', false)}
            user={user}
          />
        )}

        {currentPage === 'courses' && (
          <CoursesPage
            subjects={subjects}
            onSelectSubject={handleSelectSubject}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'course-detail' && (
          <SubjectDetailPage
            subject={selectedSubject || subjects[0]}
            onBack={() => setCurrentPage('courses')}
            onStartLearning={handleStartLearning}
            user={user}
            onOpenStudentAuth={(isReg, cb) => handleOpenAuth('student', isReg, cb)}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'contact' && <ContactPage subjects={subjects} />}

        {currentPage === 'learning' && (
          <StudentPortal
            curriculum={curriculum}
            user={user}
            onRefresh={() => fetchCurriculum(selectedSubject?.slug)}
            currentSubject={selectedSubject}
            onBackToCourses={() => setCurrentPage('courses')}
          />
        )}
      </main>

      {currentPage !== 'learning' && (
        <Footer
          onNavigate={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenStudentAuth={(isReg) => handleOpenAuth('student', isReg)}
          onOpenStaffAuth={() => handleOpenAuth('staff', false)}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <LoginModal
          initialTab={authModalTab}
          initialRegister={authModalRegister}
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
