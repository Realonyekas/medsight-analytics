import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";
import DemoDashboardPage from "./pages/DemoDashboardPage";
import PatientsPage from "./pages/PatientsPage";
import PatientDetailPage from "./pages/PatientDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import DemoRequestsPage from "./pages/DemoRequestsPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to setup if user has no hospital
  if (profile && !profile.hospital_id) {
    return <Navigate to="/setup" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, profile, isLoading } = useAuth();

  // Determine where to redirect authenticated users
  const getAuthRedirect = () => {
    if (!isAuthenticated) return '/login';
    if (profile && !profile.hospital_id) return '/setup';
    return '/dashboard';
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/demo-dashboard" element={<DemoDashboardPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to={getAuthRedirect()} replace /> : <LoginPage />} />
      <Route path="/setup" element={
        !isAuthenticated ? <Navigate to="/login" replace /> :
        (profile?.hospital_id ? <Navigate to="/dashboard" replace /> : <SetupPage />)
      } />
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/:patientId" element={<PatientDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/demo-requests" element={<DemoRequestsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
