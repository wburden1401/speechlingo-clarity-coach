
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
const queryClient = new QueryClient();

const App = () => {
  // Setup notifications and analytics when app starts
  useEffect(() => {
    // Setup notifications
    setupInitialNotifications();
    
    // Setup analytics tracking
    const trackPageView = () => {
      console.log("Analytics: Page viewed", window.location.pathname);
      // In a real app, you would send this to your analytics service
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
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <NetworkProvider>
              <AppProvider>
                <Onboarding />
                <BrowserRouter>
                  <Routes>
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    } />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
                <Toaster />
                <Sonner />
              </AppProvider>
            </NetworkProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
