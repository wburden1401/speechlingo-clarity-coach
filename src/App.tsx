
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { setupInitialNotifications } from "@/lib/notificationService";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { Onboarding } from "@/components/Onboarding";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";

// Create Query Client outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// App initialization hook
const useAppInitialization = () => {
  useEffect(() => {
    console.log("App initializing...");
    
    // Setup notifications
    setupInitialNotifications();
    
    // Setup analytics tracking
    const trackPageView = () => {
      console.log("Analytics: Page viewed", window.location.pathname);
    };
    
    // Track initial page view
    trackPageView();
    
    // Add listener for route changes
    const handleRouteChange = () => {
      trackPageView();
    };
    
    window.addEventListener("popstate", handleRouteChange);
    
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);
};

// Protected content that needs AppProvider
const ProtectedContent = () => {
  return (
    <AppProvider>
      <Onboarding />
      <Index />
    </AppProvider>
  );
};

// Main app routes component
const AppRoutes = () => {
  useAppInitialization();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <ProtectedContent />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NetworkProvider>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </NetworkProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
