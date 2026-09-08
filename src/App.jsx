import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudentPortal from './pages/StudentPortal';
import LoginModal from './components/LoginModal';
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

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('student');
  const [authModalRegister, setAuthModalRegister] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState(null);

  // Fetch all active subjects
  const fetchSubjects = async () => {
    try {
      const data = await api.getSubjects();
      setSubjects(data);
      if (data.length > 0 && !selectedSubject) {
        const djangoSub = data.find(s => s.slug === 'django-fullstack') || data[0];
        setSelectedSubject(djangoSub);
      }
    } catch (err) {
      console.error('Error fetching subjects', err);
    }
  };

  const fetchCurriculum = async (subjectSlug) => {
    setLoadingCurriculum(true);
    try {
      const slug = subjectSlug || (selectedSubject ? selectedSubject.slug : '');
      const data = await api.getCurriculum(slug);
      setCurriculum(data);
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

    const handleLogoutEvent = () => {
      setUser(null);
      setCurrentPage('home');
    };
    window.addEventListener('auth:logout', handleLogoutEvent);
    return () => window.removeEventListener('auth:logout', handleLogoutEvent);
  }, []);

  useEffect(() => {
    if (selectedSubject) fetchCurriculum(selectedSubject.slug);
  }, [selectedSubject]);

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
