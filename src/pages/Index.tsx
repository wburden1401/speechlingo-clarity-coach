
import React, { lazy, Suspense } from "react";
import { BottomNav } from "@/components/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import { useAppContext } from "@/contexts/AppContext";

// Lazy load pages with explicit chunk names for better debugging
const HomePage = lazy(() => import(/* webpackChunkName: "home-page" */ "@/pages/HomePage"));
const LearnPage = lazy(() => import(/* webpackChunkName: "learn-page" */ "@/pages/LearnPage"));
const FriendsPage = lazy(() => import(/* webpackChunkName: "friends-page" */ "@/pages/FriendsPage"));
const ProgressPage = lazy(() => import(/* webpackChunkName: "progress-page" */ "@/pages/ProgressPage"));
const ProfilePage = lazy(() => import(/* webpackChunkName: "profile-page" */ "@/pages/ProfilePage"));
const AnalyticsPage = lazy(() => import(/* webpackChunkName: "analytics-page" */ "@/pages/AnalyticsPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[80vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Main content component that renders the active tab
const MainContent = () => {
  const { state } = useAppContext();
  
  const renderActiveTab = () => {
    switch (state.activeTab) {
      case "home":
        return <HomePage />;
      case "learn":
        return <LearnPage />;
      case "friends":
        return <FriendsPage />;
      case "progress":
        return <ProgressPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderActiveTab()}
    </Suspense>
  );
};

// Main app component - this will be wrapped by AppProvider in App.tsx
const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <MainContent />
      <BottomNav />
      <OfflineIndicator />
    </div>
  );
};

export default Index;
