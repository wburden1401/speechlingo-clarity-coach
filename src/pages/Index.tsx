
import { AppProvider } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { lazy, Suspense } from "react";

// Lazy load pages to prevent potential circular dependencies
const HomePage = lazy(() => import("@/pages/HomePage"));
const LearnPage = lazy(() => import("@/pages/LearnPage")); 
const FriendsPage = lazy(() => import("@/pages/FriendsPage"));
const ProgressPage = lazy(() => import("@/pages/ProgressPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));

import { useAppContext } from "@/contexts/AppContext";

// Main content component that renders the active tab
const MainContent = () => {
  const { state } = useAppContext();
  
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      {state.activeTab === "home" && <HomePage />}
      {state.activeTab === "learn" && <LearnPage />}
      {state.activeTab === "friends" && <FriendsPage />}
      {state.activeTab === "progress" && <ProgressPage />}
      {state.activeTab === "analytics" && <AnalyticsPage />}
      {state.activeTab === "profile" && <ProfilePage />}
    </Suspense>
  );
};

// App container with context
const SpeechLingo = () => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background pb-16">
        <MainContent />
        <BottomNav />
        <OfflineIndicator />
      </div>
    </AppProvider>
  );
};

// Export the main component
const Index = () => <SpeechLingo />;

export default Index;
