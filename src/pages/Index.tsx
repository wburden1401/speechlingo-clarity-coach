
import React, { lazy, Suspense } from "react";
import { AppProvider } from "@/contexts/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { OfflineIndicator } from "@/components/OfflineIndicator";

// Lazy load pages with explicit chunk names for better debugging
const HomePage = lazy(() => import(/* webpackChunkName: "home-page" */ "@/pages/HomePage"));
const LearnPage = lazy(() => import(/* webpackChunkName: "learn-page" */ "@/pages/LearnPage"));
const FriendsPage = lazy(() => import(/* webpackChunkName: "friends-page" */ "@/pages/FriendsPage"));
const ProgressPage = lazy(() => import(/* webpackChunkName: "progress-page" */ "@/pages/ProgressPage"));
const ProfilePage = lazy(() => import(/* webpackChunkName: "profile-page" */ "@/pages/ProfilePage"));
const AnalyticsPage = lazy(() => import(/* webpackChunkName: "analytics-page" */ "@/pages/AnalyticsPage"));

import { useAppContext } from "@/contexts/AppContext";

// Main content component that renders the active tab
const MainContent = () => {
  const { state } = useAppContext();
  
  // Ensure we have a valid fallback component during loading
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[80vh]">Loading...</div>}>
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
  // Prevent rendering issues by separating the app structure from content
  return (
    <div className="min-h-screen bg-background pb-16">
      <MainContent />
      <BottomNav />
      <OfflineIndicator />
    </div>
  );
};

const Index = () => {
  return (
    <SpeechLingo />
  );
};

export default Index;
