import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { MapPage } from './pages/MapPage';
import { LearnPage } from './pages/LearnPage';
import AboutPage from './pages/AboutPage';
import { useAppStore } from './stores/appStore';

import { OfficialTopBanner } from './components/layout/OfficialTopBanner';
import { OfficialFooter } from './components/layout/OfficialFooter';
import { OfficialSafetyHub } from './components/safety/OfficialSafetyHub';
import { OfficialModals } from './components/official/OfficialModals';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-slate-800 bg-gradient-to-b from-[#A5D2FC] via-[#CCE5FD] to-[#EBF4FE] selection:bg-blue-500/20 selection:text-blue-900">
      <OfficialTopBanner />
      <Navbar />
      <Header />
      <main id="main-content" className="pt-2 pb-16" role="main">{children}</main>
      <OfficialFooter />
      <OfficialModals />
    </div>
  );
}

// User Login Route Guard: Available in USER LOGIN. In GOV LOGIN, redirects to /government
function UserRoute({ children }: { children: React.ReactNode }) {
  const { userRole, isAuthenticated, isAuthChecking } = useAppStore();

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-blue-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (userRole === 'gov') {
    return <Navigate to="/government" replace />;
  }
  return <>{children}</>;
}

// Gov Login Route Guard: Available in GOV LOGIN. Requires authenticated session.
// In USER LOGIN, Gov Portal is hidden and redirects to /dashboard
function GovRoute({ children }: { children: React.ReactNode }) {
  const { userRole, isAuthenticated, isAuthChecking } = useAppStore();

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950 text-amber-400 font-mono text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying Government Session Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userRole !== 'gov') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

function App() {
  const { checkServerSession } = useAppStore();

  useEffect(() => {
    checkServerSession();
  }, [checkServerSession]);
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* USER LOGIN ROUTES (Gov Portal is hidden) */}
          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <AppLayout>
                  <CitizenDashboard />
                </AppLayout>
              </UserRoute>
            }
          />
          <Route
            path="/map"
            element={
              <UserRoute>
                <AppLayout>
                  <MapPage />
                </AppLayout>
              </UserRoute>
            }
          />

          {/* GOV LOGIN ROUTE (Dashboard and Live Map are hidden) */}
          <Route
            path="/government"
            element={
              <GovRoute>
                <AppLayout>
                  <GovernmentDashboard />
                </AppLayout>
              </GovRoute>
            }
          />

          {/* COMMON ROUTES (Visible in BOTH User and Gov Logins) */}
          <Route
            path="/learn"
            element={
              <AppLayout>
                <LearnPage />
              </AppLayout>
            }
          />
          <Route
            path="/safety"
            element={
              <AppLayout>
                <OfficialSafetyHub />
              </AppLayout>
            }
          />
          <Route
            path="/about"
            element={
              <AppLayout>
                <AboutPage />
              </AppLayout>
            }
          />

          {/* CATCH-ALL ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
