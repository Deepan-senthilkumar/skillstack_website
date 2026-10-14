import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudentPortal from './pages/StudentPortal';
import StudentProfilePage from './pages/StudentProfilePage';
import LoginModal from './components/LoginModal';
import Footer from './components/Footer';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import DisclaimerPage from './pages/DisclaimerPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import RealAdSlot from './components/RealAdSlot';
import { api } from './api';
import { initAcademicIntegrityGuard } from './utils/academicIntegrityGuard';

// ADMIN PANEL URL — update this to your deployed admin Vercel URL
const ADMIN_PANEL_URL = import.meta.env.VITE_ADMIN_URL || 'http://localhost:5174';

export default function App() {
  const [user, setUser] = useState(api.getUser());
  const [currentPage, setCurrentPage] = useState('home');
  // 'home' | 'courses' | 'course-detail' | 'about' | 'contact' | 'learning'
  const [subjects, setSubjects] = useState(() => {
    try {
      const cached = localStorage.getItem('skillstack_cached_subjects');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [selectedSubject, setSelectedSubject] = useState(() => {
    try {
      const cached = localStorage.getItem('skillstack_cached_subjects');
      if (cached) {
        const list = JSON.parse(cached);
        return list.find(s => s.slug === 'c-programming') || list[0] || null;
      }
    } catch {}
    return null;
  });
  const [curriculum, setCurriculum] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [capabilities, setCapabilities] = useState([]);

  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('student');
  const [authModalRegister, setAuthModalRegister] = useState(false);
  const [postAuthCallback, setPostAuthCallback] = useState(null);

  const [isServerWaking, setIsServerWaking] = useState(false);

  // Fetch all active subjects (Cached)
  const fetchSubjects = async () => {
    let wakingTimer = null;
    // Only show server waking banner if we have zero subjects in state & cache
    if (subjects.length === 0) {
      wakingTimer = setTimeout(() => setIsServerWaking(true), 6000);
    }
    try {
      const data = await api.getSubjects();
      if (wakingTimer) clearTimeout(wakingTimer);
      setIsServerWaking(false);
      setSubjects(data);
      if (data.length > 0) {
        const initialSub = (selectedSubject && data.find(s => s.id === selectedSubject.id)) ||
          data.find(s => s.slug === 'c-programming') || data[0];
        setSelectedSubject(initialSub);
        if (initialSub && curriculum.length === 0) {
          fetchCurriculum(initialSub.slug);
        }
      }
    } catch (err) {
      if (wakingTimer) clearTimeout(wakingTimer);
      setIsServerWaking(false);
      console.error('Error fetching subjects', err);
    }
  };

  const fetchCurriculum = async (subjectSlug) => {
    setLoadingCurriculum(true);
    try {
      const slug = subjectSlug || (selectedSubject ? selectedSubject.slug : 'c-programming');
      if (slug) {
        const data = await api.getCurriculum(slug);
        if (Array.isArray(data) && data.length > 0) {
          setCurriculum(data);
        }
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

    const cleanupGuard = initAcademicIntegrityGuard();

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
      if (cleanupGuard) cleanupGuard();
    };
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
      setCurrentPage('profile');
    }
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
    setCurrentPage('course-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartLearning = (subject) => {
    const targetSub = subject || selectedSubject || subjects.find(s => s.slug === 'c-programming') || subjects[0];
    if (targetSub) {
      setSelectedSubject(targetSub);
      fetchCurriculum(targetSub.slug);
    }
    fetchSubjects();
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
          top: '18px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 99999,
          background: 'rgba(124, 58, 237, 0.95)',
          backdropFilter: 'blur(12px)',
          color: '#FFFFFF',
          padding: '10px 22px',
          borderRadius: '9999px',
          boxShadow: '0 12px 30px -4px rgba(124, 58, 237, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 700,
          border: '1px solid rgba(255, 255, 255, 0.25)',
          pointerEvents: 'none'
        }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#F472B6', boxShadow: '0 0 10px #F472B6' }} />
          <span>⚡ Backend cluster is spinning up from standby... Connecting now.</span>
        </div>
      )}
      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={(page) => {
          if (subjects.length === 0) {
            fetchSubjects();
          }
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
            user={user}
            onSelectSubject={handleSelectSubject}
            onStartLearning={handleStartLearning}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStudentAuth={(isReg, cb) => handleOpenAuth('student', isReg, cb)}
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

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'terms' && (
          <TermsPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'disclaimer' && (
          <DisclaimerPage
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'profile' && (
          <StudentProfilePage
            user={user}
            subjects={subjects}
            onStartLearning={handleStartLearning}
            onNavigate={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'learning' && (
          <StudentPortal
            curriculum={curriculum}
            user={user}
            onRefresh={() => fetchCurriculum(selectedSubject?.slug)}
            currentSubject={selectedSubject}
            onBackToCourses={() => setCurrentPage('courses')}
            onOpenProfile={() => setCurrentPage('profile')}
          />
        )}

        {/* Global Google AdSense Display Ad Unit on All Public Pages */}
        {currentPage !== 'learning' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center">
            <RealAdSlot slotType="banner" />
          </div>
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

      {/* Cookie & AdSense Consent Banner (Disabled as requested) */}
      {/* 
      <CookieConsentBanner
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      */}

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
