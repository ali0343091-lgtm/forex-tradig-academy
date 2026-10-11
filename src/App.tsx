/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { SettingsProvider } from './context/SettingsContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { MarketTicker } from './components/MarketTicker.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { FeesPage } from './pages/FeesPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { PaymentInstructionsPage } from './pages/PaymentInstructionsPage.tsx';
import { PaymentSubmissionPage } from './pages/PaymentSubmissionPage.tsx';
import { StatusPage } from './pages/StatusPage.tsx';
import { StudentDashboardPage } from './pages/StudentDashboardPage.tsx';
import { ClassLibraryPage } from './pages/ClassLibraryPage.tsx';
import { ClassWatchPage } from './pages/ClassWatchPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { ChangePasswordPage } from './pages/ChangePasswordPage.tsx';
import { AdminLoginPage } from './pages/AdminLoginPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    // Read initial path or ?page= query parameter
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      return `/${pageParam.replace(/^\//, '')}`;
    }
    return window.location.pathname || '/';
  });

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Router logic
  const renderCurrentPage = () => {
    const path = currentPath;

    // Parameterized route: /classes/:id
    if (path.startsWith('/classes/') && path !== '/classes/') {
      const lessonId = path.replace('/classes/', '');
      return <ClassWatchPage lessonId={lessonId} navigate={navigate} />;
    }

    switch (path) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/about':
        return <AboutPage navigate={navigate} />;
      case '/fees':
        return <FeesPage navigate={navigate} />;
      case '/register':
        return <RegisterPage navigate={navigate} />;
      case '/login':
        return <LoginPage navigate={navigate} />;
      case '/payment-instructions':
        return <PaymentInstructionsPage navigate={navigate} />;
      case '/payment-submission':
        return <PaymentSubmissionPage navigate={navigate} />;
      case '/status':
        return <StatusPage navigate={navigate} />;
      case '/student-dashboard':
        return <StudentDashboardPage navigate={navigate} />;
      case '/classes':
        return <ClassLibraryPage navigate={navigate} />;
      case '/profile':
        return <ProfilePage navigate={navigate} />;
      case '/change-password':
        return <ChangePasswordPage navigate={navigate} />;
      case '/admin-login':
        return <AdminLoginPage navigate={navigate} />;
      case '/admin':
        return <AdminDashboardPage navigate={navigate} />;
      case '/contact':
        return <ContactPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPolicyPage />;
      case '/terms':
        return <TermsPage />;
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <SettingsProvider>
        <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
          {/* Top Live Forex Ticker Bar */}
          <MarketTicker />

          {/* Navigation Bar */}
          <Navbar currentPath={currentPath} navigate={navigate} />

          {/* Active Page Body */}
          <main className="flex-1">
            {renderCurrentPage()}
          </main>

          {/* Footer with Payment Strips and Links */}
          <Footer navigate={navigate} />
        </div>
      </SettingsProvider>
    </AuthProvider>
  );
}
