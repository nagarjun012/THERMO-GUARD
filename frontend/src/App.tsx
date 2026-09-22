import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IndustrialShell } from './components/industrial/IndustrialShell';
import { IndustrialOverview } from './pages/IndustrialOverview';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { HeatZonesPage } from './pages/HeatZonesPage';
import { AlertsWorkspacePage } from './pages/AlertsWorkspacePage';
import { ReportsPage } from './pages/ReportsPage';
import { DevicesPage } from './pages/DevicesPage';
import { TeamSettingsPage } from './pages/TeamSettingsPage';
import { MapPage } from './pages/MapPage';
import { GovernmentDashboard } from './pages/GovernmentDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { LearnPage } from './pages/LearnPage';
import AboutPage from './pages/AboutPage';
import { OfficialSafetyHub } from './components/safety/OfficialSafetyHub';
import { useAppStore } from './stores/appStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { checkServerSession } = useAppStore();

  useEffect(() => {
    checkServerSession();
  }, [checkServerSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <IndustrialShell>
          <Routes>
            {/* 1. Core Industrial Workspaces */}
            <Route path="/" element={<IndustrialOverview />} />
            <Route path="/dashboard" element={<IndustrialOverview />} />
            <Route path="/monitoring" element={<LiveMonitoringPage />} />
            <Route path="/zones" element={<HeatZonesPage />} />
            <Route path="/alerts" element={<AlertsWorkspacePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/team" element={<TeamSettingsPage initialTab="team" />} />
            <Route path="/settings" element={<TeamSettingsPage initialTab="settings" />} />

            {/* 2. Network & Regional GIS Heat Risk Telemetry */}
            <Route path="/map" element={<MapPage />} />
            <Route path="/government" element={<GovernmentDashboard />} />
            <Route path="/citizen" element={<CitizenDashboard />} />

            {/* 3. Scientific & Clinical Safety Guidelines */}
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/safety" element={<OfficialSafetyHub />} />
            <Route path="/about" element={<AboutPage />} />

            {/* 4. Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </IndustrialShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
