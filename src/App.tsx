
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { AppProvider } from "@/contexts/AppContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { NetworkProvider } from "@/contexts/NetworkContext";
import { Onboarding } from "@/components/Onboarding";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { setupInitialNotifications } from "@/lib/notificationService";

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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
            </AppProvider>
          </NetworkProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
